import { Routes } from '@angular/router';
import { startPageGuard } from '@core';
import { authSimpleCanActivate, authSimpleCanActivateChild } from '@delon/auth';

import { DashboardComponent } from './dashboard/dashboard.component';
import { WorkbenchComponent } from './dashboard/workbench/workbench.component';
import { MonitorComponent } from './dashboard/monitor/monitor.component';
import { LayoutBasicComponent } from '../layout';
import { tabGuard } from '../core/guards/tab.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutBasicComponent,
    canActivate: [startPageGuard, authSimpleCanActivate],
    canActivateChild: [authSimpleCanActivateChild],
    data: {},
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [tabGuard],
        data: { title: '儀表板' }
      },
      { 
        path: 'workbench', 
        component: WorkbenchComponent,
        canActivate: [tabGuard],
        data: { title: '工作臺' }
      },
      { 
        path: 'monitor', 
        component: MonitorComponent,
        canActivate: [tabGuard],
        data: { title: '監控頁' }
      }
    ]
  },
  // passport
  { path: '', loadChildren: () => import('./passport/routes').then(m => m.routes) },
  { path: 'exception', loadChildren: () => import('./exception/routes').then(m => m.routes) },
  { path: '**', redirectTo: 'exception/404' }
];
