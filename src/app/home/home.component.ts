import {
  Component,
  OnInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { IMyOptions, IMyDateModel, IMyDate, MyDatePicker } from 'mydatepicker';
import { AppState } from '../app.service';
import { HomeService } from './home.service';
import { UtilService } from '../common/service/utils';
import { HomeChartService } from './home.chart.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'home',  // <home></home>
  providers: [
  ],
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  // Set our default values
  public localState = { value: '' };
  public ckeditorContent = '';
  public isDataLoaded = false;
  public todayDate = new Date();
  public currentDate = new Date().getTime();
  // 这个地方之所以不用IMyOptions， 是因为其不支持disableDateRange
  public myDatePickerOptions: IMyOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
    showInputField: false,
    inline: true,
    // disableDays: [
    //   {
    //     year: 2017,
    //     month: 4,
    //     day: 2
    //   }
    // ],
    disableDateRanges: [{
      begin: {
        year: 2000,
        month: 1,
        day: 1
      },
      end: {
        year: this.todayDate.getFullYear(),
        month: 12,
        day: 31
      }
    }],
    disableSince: {
      year: this.todayDate.getFullYear(),
      month: this.todayDate.getMonth() + 1,
      day: this.todayDate.getDate()
    }
  };
  private selDate: IMyDate = { year: 0, month: 0, day: 0 };
  // TypeScript public modifiers
  constructor(
    public appState: AppState,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private homeService: HomeService,
    private homeChartService: HomeChartService,
    private utilService: UtilService
  ) { }
  public ngOnInit() {
    this.activeRoute.queryParams.subscribe((data: any) => {
      if (typeof data.date === 'undefined') {
        let dateObj = new Date();
        this.router.navigate([this.router.url], {
          queryParams: {
            date: dateObj.getTime()
          }
        });
        this.selDate = {
          year: dateObj.getFullYear(),
          month: dateObj.getMonth() + 1,
          day: dateObj.getDate()
        };
      } else {
        let dateObj = new Date(Number(data.date));
        this.selDate = {
          year: dateObj.getFullYear(),
          month: dateObj.getMonth() + 1,
          day: dateObj.getDate()
        };
        this.currentDate = data.date;
      }
    });
    this.homeService.getNav().then((data) => {
      this.isDataLoaded = true;
      data = data.json();
      let enableDays = data.data.dates;
      let todayDateObj = new Date();
      todayDateObj.setHours(12);
      todayDateObj.setMinutes(0);
      let todayTime = this.utilService.convert12Date(todayDateObj.getTime());
      if (enableDays.indexOf(todayTime) === -1) {
        enableDays.push(todayTime);
      }
      enableDays = enableDays.map((value, key) => {
        let tempDate = new Date(Number(value));
        return {
          year: tempDate.getFullYear(),
          month: tempDate.getMonth() + 1,
          day: tempDate.getDate()
        };
      });
      this.myDatePickerOptions.enableDays = enableDays;
    });
  }
  public isActive(urlStr) {
    return this.router.isActive(urlStr, false);
  }
  public submitState(value: string) {
    this.appState.set('value', value);
    this.localState.value = '';
  }

  public deleteData(id) {
    return this.homeService.deleteData({
      id
    });
  }
  public updateData(type, date, content, id, updateDate) {
    return this.homeService.updateData({
      type,
      date: this.utilService.convert12Date(date),
      content,
      id,
      updateDate
    });
  }
  public addData(type, date, content) {
    return this.homeService.addData({
      type,
      date: this.utilService.convert12Date(date),
      content,
    });
  }
  public getData(type, date) {
    return this.homeService.getData({
      type,
      date: this.utilService.convert12Date(date),
    });
  }
  private onDateChanged(event: IMyDateModel) {
    this.currentDate = new Date(event.date.year + '/' + event.date.month + '/' + event.date.day)
      .getTime();
    this.router.navigate([this.router.url.split('?')[0]], {
      queryParams: {
        date: this.currentDate
      }
    });
    this.homeChartService.boardcast('date_change');
  }
}
