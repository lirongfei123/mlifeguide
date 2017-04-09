import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
@Injectable()
export class HomeChartService {
    public homeSource = new Subject<string>();
    public homeObserver = this.homeSource.asObservable();
    // Service message commands
    public boardcast(mission: string) {
        this.homeSource.next(mission);
    }
}
