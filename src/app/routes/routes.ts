import { Routes } from '@angular/router';
import { startPageGuard } from '@core';
import { authSimpleCanActivate, authSimpleCanActivateChild } from '@delon/auth';


import { WorkbenchComponent } from './dashboard/workbench/workbench.component';
import { MonitorComponent } from './dashboard/monitor/monitor.component';
import { AnalysisComponent } from './dashboard/analysis/analysis.component';
import { ContractsComponent } from './dashboard/contracts/contracts.component';
import { TreeListComponent } from './dashboard/tree-list/tree-list.component';
import { FirestoreDemoComponent } from './dashboard/firestore-demo/firestore-demo.component';
import { ClientsComponent } from './dashboard/clients/clients.component';
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
      { path: '', redirectTo: 'dashboard/workbench', pathMatch: 'full' },
      {
        path: 'dashboard',
        children: [
          { path: '', redirectTo: 'workbench', pathMatch: 'full' },
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
          },
          { 
            path: 'analysis', 
            component: AnalysisComponent,
            canActivate: [tabGuard],
            data: { title: '分析頁' }
          },
          { 
            path: 'contracts', 
            component: ContractsComponent,
            canActivate: [tabGuard],
            data: { title: '合約管理' }
          },
          { 
            path: 'tree-list', 
            component: TreeListComponent,
            canActivate: [tabGuard],
            data: { title: '樹狀表格' }
          },
          { 
            path: 'client', 
            component: ClientsComponent,
            canActivate: [tabGuard],
            data: { title: 'Client' }
          },
          { 
            path: 'firestore-demo', 
            component: FirestoreDemoComponent,
            canActivate: [tabGuard],
            data: { title: 'Firestore 範例' }
          }
        ]
      }
    ]
  },
  // passport
  { path: '', loadChildren: () => import('./passport/routes').then(m => m.routes) },
  { path: 'exception', loadChildren: () => import('./exception/routes').then(m => m.routes) },
  { path: '**', redirectTo: 'exception/404' }
];
