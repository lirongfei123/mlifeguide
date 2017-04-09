import { Inject, Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Router, Route, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class HomeService {
    constructor(
        private http: Http,
        private route: ActivatedRoute,
        private router: Router
    ) {
        // void
    }
    public getNav(): Promise<any> {
        return this.http.get('/my-project/mlife-guide-re/index.php?index!getnav').toPromise();
    }
    public updateData(data): Promise<any> {
        return this.http.post('/my-project/mlife-guide-re/index.php?index!updateData',
            data).toPromise();
    }
    public deleteData(data): Promise<any> {
        return this.http.post('/my-project/mlife-guide-re/index.php?index!deleteData',
            data).toPromise();
    }
    public addData(data): Promise<any> {
        return this.http.post('/my-project/mlife-guide-re/index.php?index!addData',
            data).toPromise();
    }
    public getData(options): Promise<any> {
        let params = new URLSearchParams();
        for (let i in options) {
            if (options.hasOwnProperty(i)) {
                params.set(i, options[i]);
            }
        }
        return this.http.get('/my-project/mlife-guide-re/index.php?index!getData', {
            search: params
        }).toPromise();
    }
}
