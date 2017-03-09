import { Injectable } from '@angular/core';
@Injectable()
export class UtilService {
    public convert12Date(date) {
        let dateObj = new Date(Number(date));
        let newDateObj = new Date(dateObj.getFullYear() + '/'
        + (dateObj.getMonth() + 1) + '/' + dateObj.getDate() + ' 12:00');
        return newDateObj.getTime();
    }
}