import { differenceInDays, format } from "date-fns";
import { Observable } from "rxjs";
import {
  concatMap,
  flatMap,
  map,
  mergeMap,
  switchMap,
  tap
} from "rxjs/operators";
import { DSDossier } from "../../demarche-simplifiee";
import { logger } from "../../util";
import { DossierRecord, ProcedureConfig } from "../model";
import {
  DossierStatesCount,
  initStatistic,
  initStatisticBlock,
  Statistic
} from "../model/statistic.model";
import { dossierRepository, statisticRepository } from "../repository";
import { dsProcedureConfigService } from "./ds-config.service";

const DS_STATUSES_COMPLETED = ["closed", "refused", "without_continuation"];

class StatisticService {
  public findByGroupId(groupId: string): Observable<Statistic> {
    return statisticRepository
      .findByGroupId(groupId)
      .pipe(map((res: Statistic[]) => res[0]));
  }

  public statistic(): Observable<any> {
    return dsProcedureConfigService.all().pipe(
      flatMap((x: ProcedureConfig[]) => x),
      tap((res: ProcedureConfig) =>
        logger.info(
          `[StatisticService.statistic] Refresh stats for group ${res.group.id}`
        )
      ),
      concatMap((x: ProcedureConfig) => this.statisticByProcedure(x))
    );
  }

  private statisticByProcedure(param: ProcedureConfig) {
    return dossierRepository.findAllByProcedureIn(param.procedures).pipe(
      map((dossiers: DossierRecord[]) => {
        return dossiers.reduce((acc: Statistic, current) => {
          const dossier = current.ds_data;
          const state = current.metadata.state;

          const monthlyStat = this.getMonthlyStatistic(
            acc,
            new Date(dossier.created_at)
          );

          acc.count++;
          acc.status[state].count++;

          monthlyStat.count++;
          monthlyStat.status[state].count++;

          if (DS_STATUSES_COMPLETED.indexOf(dossier.state) > -1) {
            const delayInDays = computeDuration(dossier);

            this.updateDuration(acc, delayInDays);
            this.updateDuration(monthlyStat, delayInDays);
          }

          return acc;
        }, initStatistic(param.group));
      }),
      switchMap((stat: Statistic) => {
        return this.saveOrUpdate(stat);
      })
    );
  }

  private saveOrUpdate(stat: Statistic): Observable<Statistic> {
    return statisticRepository.findByGroupId(stat.group.id).pipe(
      mergeMap((res: Statistic[]) => {
        if (res.length === 0) {
          logger.debug(
            `[StatisticService.saveOrUpdate] no record for structure ${
              stat.group.id
            }`
          );
          return statisticRepository.add(stat);
        } else {
          const record: Statistic = res[0];
          Object.assign(record, stat);
          logger.debug(
            `[StatisticService.saveOrUpdate] record found for structure ${
              stat.group.id
            } id#${record.id}`
          );
          return statisticRepository.update(record.id || "", record);
        }
      })
    );
  }

  private updateDuration(
    param: {
      duration: number;
      durations: number[];
      status: DossierStatesCount;
    },
    delayInDays: number
  ) {
    const durationsNb = param.durations.length;
    param.duration =
      (param.duration * durationsNb + delayInDays) / (durationsNb + 1);
    param.durations.push(delayInDays);
  }

  private getMonthlyStatistic(stat: Statistic, date: Date) {
    const monthKey = format(date, "YYYY-MM");
    let monthStat = stat.monthly[monthKey];
    if (!monthStat) {
      monthStat = initStatisticBlock();
      stat.monthly[monthKey] = monthStat;
    }
    return monthStat;
  }
}

export const statisticService = new StatisticService();

// compute some dossier duration in days
const computeDuration = (dossier: DSDossier) =>
  differenceInDays(dossier.processed_at, dossier.initiated_at);
