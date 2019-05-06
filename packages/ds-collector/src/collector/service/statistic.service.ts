import { Observable } from "rxjs";
import { concatMap, flatMap, map, mergeMap, switchMap, tap } from "rxjs/operators";
import { DossierStateType } from "../../demarche-simplifiee";
import { logger } from "../../util";
import { DossierRecord, ProcedureConfig } from "../model";
import { DossierStatesCount, initStatistic, initStatisticBlock, Statistic } from "../model/statistic.model";
import { dossierRepository, statisticRepository } from "../repository";
import { dsProcedureConfigService } from "./ds-config.service";


class StatisticService {

    public findByGroupId(groupId: string): Observable<Statistic> {
        return statisticRepository.findByGroupId(groupId).pipe(
            map(res => res[0])
        );
    }

    public statistic(): Observable<any> {
        return dsProcedureConfigService.all().pipe(
            flatMap(x => x),
            tap(res => logger.info(`[StatisticService.statistic] Refresh stats for group ${res.group.id}`)),
            concatMap((x) => this.statisticByProcedure(x)),
        );
    }

    private statisticByProcedure(param: ProcedureConfig) {
        return dossierRepository.findAllByProcedureIn(param.procedures).pipe(
            map((dossiers: DossierRecord[]) => {
                return dossiers.reduce((acc: Statistic, current) => {
                    const createdAt = current.metadata.created_at;
                    const receivedAt = current.metadata.received_at;
                    const processedAt = current.metadata.processed_at;

                    const generalBlock = acc;

                    this.incrementStatus(generalBlock, 'initiated');
                    this.incrementMonthlyStatus(acc, createdAt, 'initiated');

                    if (receivedAt) {
                        this.incrementStatus(generalBlock, 'received');
                        this.incrementMonthlyStatus(acc, receivedAt, 'received');
                    }

                    if (processedAt) {
                        this.incrementStatus(generalBlock, current.metadata.state);
                        this.incrementMonthlyStatus(acc, processedAt, current.metadata.state);

                        const delayInDays = diffIndays(createdAt, processedAt);
                        this.updateDuration(generalBlock, delayInDays);
                        const monthlyStatistic = this.getMonthlyStatistic(acc, processedAt);
                        this.updateDuration(monthlyStatistic, delayInDays);

                    }

                    return acc;
                }, initStatistic(param.group))
            }),
            switchMap((stat) => {
                return this.saveOrUpdate(stat);
            })
        )
    }

    private saveOrUpdate(stat: Statistic): Observable<Statistic> {
        return statisticRepository.findByGroupId(stat.group.id).pipe(
            mergeMap((res: Statistic[]) => {
                if (res.length === 0) {
                    logger.debug(`[StatisticService.saveOrUpdate] no record for structure ${stat.group.id}`)
                    return statisticRepository.add(stat);
                } else {
                    const record: Statistic = res[0];
                    Object.assign(record, stat);
                    logger.debug(`[StatisticService.saveOrUpdate] record found for structure ${stat.group.id} id#${record.id}`)
                    return statisticRepository.update(record.id || '', record);
                }
            })
        )
    }

    private updateDuration(param: { duration: number, durations: number[], status: DossierStatesCount }, delayInDays: number) {
        const durationsNb = param.durations.length || 0;

        param.durations.push(delayInDays);
        param.duration = (param.duration * durationsNb + delayInDays) / (durationsNb + 1);

    }

    private incrementStatus(param: { count: number, status: DossierStatesCount }, state: DossierStateType) {
        param.status[state].count++;
        param.count++;
    }

    private incrementMonthlyStatus(acc: Statistic, at: number, stateType: DossierStateType) {
        const stat = this.getMonthlyStatistic(acc, at);
        this.incrementStatus(stat, stateType);
    }

    private getMonthKey(timestamp: number) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = date.getMonth().toString().padStart(2, "0");
        return `${year}-${month}`;
    }

    private getMonthlyStatistic(stat: Statistic, timestamp: number) {
        const monthKey = this.getMonthKey(timestamp);
        let monthStat = stat.monthly[monthKey];
        if (!monthStat) {
            monthStat = initStatisticBlock();
            stat.monthly[monthKey] = monthStat;
        }
        return monthStat;
    }

}

export const statisticService = new StatisticService();

const diffIndays = (createdAt: number, processedAt: number) => {
    return Math.round(processedAt - createdAt) / (1000 * 60 * 60 * 24);
}


