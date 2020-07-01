import { Observable, from } from "rxjs";
import { Statistic } from "../model/statistic.model";
import { StatisticModel } from "../database/StatisticModel";

class StatisticRepository {
  public all(): Observable<Statistic[]> {
    return from(StatisticModel.query());
  }

  public add(stat: Statistic): Observable<Statistic> {
    return from(StatisticModel.query().insert(stat));
  }

  public update(id: string, stat: Statistic): Observable<Statistic> {
    return from(StatisticModel.query().patchAndFetchById(id, stat));
  }

  public findByGroupId(groupId: string): Observable<Statistic[]> {
    return from(
      StatisticModel.query().whereRaw(`"group" @> '{"id":"${groupId}"}'::jsonb`)
    );
  }
}

export const statisticRepository = new StatisticRepository();
