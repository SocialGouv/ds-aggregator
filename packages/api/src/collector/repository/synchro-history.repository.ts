import { Observable, from } from "rxjs";
import { SynchroHistory } from "../model";
import { SynchroHistoryModel } from "../database/SynchoHistoryModel";

class SynchroHistoryRepository {
  public all(): Observable<SynchroHistory[]> {
    return from(
      SynchroHistoryModel.query().then((res: SynchroHistoryModel[]) => {
        if (!res) {
          return [];
        }
        return res.map((elm) => this.databaseToModel(elm));
      })
    );
  }

  public add(synchroHistory: SynchroHistory): Observable<SynchroHistory> {
    return from(SynchroHistoryModel.query().insert(synchroHistory));
  }

  public update(
    id: string,
    synchroHistory: SynchroHistory
  ): Observable<SynchroHistory> {
    return from(
      SynchroHistoryModel.query()
        .patchAndFetchById(id, synchroHistory)
        .then((res: SynchroHistoryModel) => {
          return this.databaseToModel(res);
        })
    );
  }

  private databaseToModel(entity: SynchroHistoryModel): SynchroHistory {
    return {
      id: entity.id,
      scheduler: entity.scheduler,
      last_synchro: entity.last_synchro,
    };
  }
}

export const synchroHistoryRepository = new SynchroHistoryRepository();
