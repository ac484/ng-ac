import { Routes } from '@angular/router';

import { DashboardAnalysisComponent } from './analysis/analysis.component';
import { DashboardMonitorComponent } from './monitor/monitor.component';
import { DashboardV1Component } from './v1/v1.component';
import { DashboardWorkplaceComponent } from './workplace/workplace.component';
import { BudgetListComponent } from '../../domains/budget-management';
import { CompanyListComponent } from '../../domains/business-partner';
import { ContractListComponent, ContractCreateComponent } from '../../domains/contract-management';
import { TaskListComponent } from '../../domains/task-management';

export const routes: Routes = [
  { path: '', redirectTo: 'v1', pathMatch: 'full' },
  { path: 'v1', component: DashboardV1Component },
  { path: 'analysis', component: DashboardAnalysisComponent },
  { path: 'monitor', component: DashboardMonitorComponent },
  { path: 'workplace', component: DashboardWorkplaceComponent },
  {
    path: 'contract-management',
    children: [
      { path: '', component: ContractListComponent },
      { path: 'create', component: ContractCreateComponent }
    ]
  },
  { path: 'task-management', component: TaskListComponent },
  { path: 'budget-management', component: BudgetListComponent },
  { path: 'business-partner', component: CompanyListComponent }
];
