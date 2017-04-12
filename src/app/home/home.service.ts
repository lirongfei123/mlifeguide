import { Inject, Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Router, Route, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class HomeService {
    private option =  new RequestOptions({ 
        headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' })
    });
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
            this.convertBody(data), this.option).toPromise();
    }
    public deleteData(data): Promise<any> {
        return this.http.post('/my-project/mlife-guide-re/index.php?index!deleteData',
            this.convertBody(data), this.option).toPromise();
    }
    public addData(data): Promise<any> {
        return this.http.post('/my-project/mlife-guide-re/index.php?index!addData',
            this.convertBody(data), this.option).toPromise();
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
    private convertBody(body): any {
        let data = new URLSearchParams();
        for (let i in body) {
            if (body.hasOwnProperty(i)) {
                data.append(i, body[i]);
            }
        }
        console.log(data);
        return data;
    }
}
