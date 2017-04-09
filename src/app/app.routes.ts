import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { BacisEditorComponent } from './home/basic/basic.component';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'codeskill',
        pathMatch: 'full'
      },
      {
        path: 'codeskill',
        component: BacisEditorComponent
      },
      {
        path: 'beautlife',
        component: BacisEditorComponent
      },
      {
        path: 'daily',
        component: BacisEditorComponent
      }
    ]
  },
  { path: 'detail', loadChildren: './+detail#DetailModule'},
  { path: 'barrel', loadChildren: './+barrel#BarrelModule'},
  { path: '**',    component: NoContentComponent },
];
