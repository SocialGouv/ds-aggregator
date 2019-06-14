import { Observable } from "rxjs";
import { KintoCollection } from "../../lib";
import { Statistic } from "../model/statistic.model";
import { kintoClientInstance } from "./kinto-client-instance";

class StatisticRepository {
  private collection: KintoCollection<Statistic>;

  constructor() {
    this.collection = kintoClientInstance.collection<Statistic>("statistics");
  }

  public all(): Observable<Statistic[]> {
    return this.collection.all();
  }

  public add(stat: Statistic): Observable<Statistic> {
    return this.collection.add(stat);
  }

  public update(id: string, stat: Statistic): Observable<Statistic> {
    return this.collection.update(id, stat);
  }

  public findByGroupId(groupId: string): Observable<Statistic[]> {
    return this.collection.search(`group.id="${groupId}"`);
  }
}

export const statisticRepository = new StatisticRepository();
