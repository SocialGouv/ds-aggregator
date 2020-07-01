import { Observable, of } from "rxjs";
import { mergeMap, tap } from "rxjs/operators";
import { SynchroHistory } from "../model";
import { synchroHistoryRepository } from "../repository";

class SynchroHistoryService {
  public getSynchroHistory(scheduler: string): Observable<SynchroHistory> {
    return synchroHistoryRepository.all().pipe(
      mergeMap((res: SynchroHistory[]) => {
        const syncHistory = res.find(
          (elm: SynchroHistory) => elm.scheduler === scheduler
        );
        if (syncHistory) {
          return of(syncHistory);
        } else {
          return synchroHistoryRepository.add({
            last_synchro: new Date(0),
            scheduler,
          });
        }
      })
    );
  }

  public update(
    scheduler: string,
    lastSynchro: number
  ): Observable<SynchroHistory> {
    return this.getSynchroHistory(scheduler).pipe(
      tap(
        (synchroHistory: SynchroHistory) =>
          (synchroHistory.last_synchro = new Date(lastSynchro))
      ),
      mergeMap((synchroHistory: SynchroHistory) =>
        synchroHistoryRepository.update(synchroHistory.id || "", synchroHistory)
      )
    );
  }
}

export const synchroHistoryService = new SynchroHistoryService();
