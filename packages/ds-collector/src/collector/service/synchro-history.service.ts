import { Observable, of } from "rxjs";
import { mergeMap, tap } from "rxjs/operators";
import { SynchroHistory } from "../model";
import { synchroHistoryRepository } from "../repository";

class SynchroHistoryService {

    public getSynchroHistory(scheduler: string): Observable<SynchroHistory> {
        return synchroHistoryRepository.all().pipe(
            mergeMap(res => {
                const syncHistory = res.find(elm => elm.scheduler === scheduler);
                if (syncHistory) {
                    return of(syncHistory);
                } else {
                    return synchroHistoryRepository.add({
                        last_synchro: 0,
                        scheduler
                    });
                }
            })
        )
    }

    public update(scheduler: string, lastSynchro: number): Observable<SynchroHistory> {
        return this.getSynchroHistory(scheduler).pipe(
            tap((synchroHistory) => synchroHistory.last_synchro = lastSynchro),
            mergeMap(synchroHistory => synchroHistoryRepository.update(synchroHistory.id || '', synchroHistory))
        )
    }


}




export const synchroHistoryService = new SynchroHistoryService();