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
      if (data[0].path === 'codeskill' || data[0].path === 'beautlife') {
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
    this.blur(0);
  }
  public deleteItem(index) {
    let result = confirm('你确定要删除吗？');
    if (result) {
      this.homeComponent.deleteData(this.data[index].id).then( () => {
        this.data.splice(index, 1);
        if (this.data.length === 0) {
          this.data.unshift({
            mark: '',
            content: ''
          });
        }
      });
    }
  }
  public onEditorBlur(index: number, event) {
    this.data[index].content = event.content;
    this.data[index].height = event.height;
    this.blur(index);
  }
  public onEditorChange(index: number, event) {
    let item = this.data[index];
    localStorage.setItem('content' + item.id,
    (new Date().getTime() - 3).toString().slice(0, -3) + '===___===' + item.content);
  }
  public onMarkBlur(index: number, event) {
    this.data[index].mark = event;
    this.blur(index);
  }
  private blur(index: number) {
    let contentValue = this.data[index];
    let div = document.createElement('div');
    div.innerHTML = contentValue.content;
    if (div.innerText.trim() === '') {
      return;
    }
    if (typeof contentValue.id !== 'undefined') {
      this.homeComponent.updateData(
        this.type,
        this.date,
        JSON.stringify(this.data[index]),
        contentValue.id, this.data[index].updateDate).then((data) => {
          data = data.json();
          if (data.code !== 1 && data.data === 'conflict') {
            alert('已经有新的提交，请复制内容后，刷新页面重新提交');
          } else {
            this.data[index].updateDate = data.data.updateDate;
          }
        });
    } else {
      this.homeComponent.addData(
        this.type,
        this.date,
        JSON.stringify(this.data[index])).then((data) => {
          let result = data.json();
          this.data[index].id = result.data.id;
          this.data[index].updateDate = result.data.updateDate;
        });
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
        let editData = [];
        data.data = JSON.parse(data.data);
        if (data.data.length === 0) {
          if (this.type === 'daily') {
            editData.push({
              mark: '日记',
              content: ''
            });
            editData.push({
              mark: '计划',
              content: ''
            });
          } else {
            editData.push({
              mark: '',
              content: ''
            });
          }
          
        } else {
          editData = data.data;
          editData = editData.map((value, key) => {
            let id = value.id;
            let updateDate = value.updateDate;
            let content = jsonEscape(value.content);
            let startStr = '","content":"';
            let endStr = '","height":';
            let start = content.indexOf(startStr);
            let end = content.indexOf(endStr);
            content = content.substring(0, start)
            + startStr
            + content.substring(start + startStr.length, end).replace(/"/g, '\\\"')
            + endStr
            + content.substring(end + endStr.length);
            value = JSON.parse(content);
            value.id = id;
            value.updateDate = updateDate;
            // 读取localStorage的缓存
            let oldStorage = localStorage.getItem('content' + id);
            if (oldStorage !== null) {
              let oldContent = oldStorage.split('===___===');
              let oldUpdateDate = Number(oldContent[0]);
              if (oldUpdateDate - updateDate > 0) {
                value.content = oldContent[1];
              }
            }
            return value;
          });
        }
        this.data = editData;
      });
    }, 1000);
    function jsonEscape(str) {
      return str.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
    }
  }
}
