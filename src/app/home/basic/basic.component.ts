import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { ActivatedRoute, Route, Router } from '@angular/router';
import { HomeChartService } from '../home.chart.service';
import { HomeService } from '../home.service';
import { HomeComponent } from '../home.component';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'code-skill',
  styleUrls: ['./basic.component.scss'],
  templateUrl: './basic.component.html',
})
export class BacisEditorComponent implements OnInit, OnDestroy {
  public data: EditorItem[] = [];
  public editorType: string;
  public id: number = -1;
  public type: string;
  public date: string;
  private timer: any;
  private eventLisener: Subscription;
  private historyValue: string = '';
  constructor(
    private homeComponent: HomeComponent,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private homeChartService: HomeChartService
  ) {
    this.initRequestParamAndInitData();
  }
  public ngOnInit() {
    this.activeRoute.url.subscribe((data) => {
      if (data[0].path === 'codeskill') {
        this.editorType = 'ckeditor';
      } else {
        this.editorType = 'textarea';
      }
    });
    this.eventLisener = this.homeChartService.homeObserver.subscribe(() => {
        this.initRequestParamAndInitData();
    });
  }
  public ngOnDestroy() {
    this.eventLisener.unsubscribe();
  }
  public dateChange() {
    this.initRequestParamAndInitData();
  }
  public addNew() {
    this.data.unshift({
      mark: '',
      content: ''
    });
    this.blur();
  }
  public deleteItem(index) {
    if (this.data.length > 1) {
      this.data.splice(index, 1);
      this.blur();
    }
  }
  public onEditorBlur(index: number, event) {
    this.data[index].content = event.content;
    this.data[index].height = event.height;
    this.blur();
  }
  public onMarkBlur(index: number, event) {
    this.data[index].mark = event;
    this.blur();
  }
  private blur() {
    let isNull = true;
    let tempData = this.data.filter((value, key) => {
      if (value.content.trim() !== '' || value.mark.trim() !== '') {
        return true;
      } else {
        return false;
      }
    });
    if (tempData.length > 0 || (this.historyValue !== null)) {
      this.historyValue = JSON.stringify(this.data);
      this.homeComponent.updateData(
        this.type,
        this.date,
        JSON.stringify(this.data),
        this.id === -1 ? null : this.id);
    }
  }
  private initRequestParamAndInitData() {
    this.activeRoute.url.subscribe((urls) => {
      this.type = urls[0].path;
    });
    this.activeRoute.queryParams.subscribe((params) => {
      this.date = params['date'];
    });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.homeComponent.getData(this.type, this.date).then((data) => {
          data = data.json();
          this.id = data.id;
          function jsonEscape(str)  {
              return str.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
          }
          let dataObj = JSON.parse(jsonEscape(data.data));
          if (dataObj.length === 0) {
            dataObj.push({
                mark: '',
                content: ''
            });
          }
          this.data = dataObj;
      });
    }, 1000);
  }
}
