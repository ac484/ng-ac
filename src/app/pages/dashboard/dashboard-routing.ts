import { Route } from '@angular/router';

export default [
  { path: '', redirectTo: 'analysis', pathMatch: 'full' },
  {
    title: '分析页',
    path: 'analysis',
    data: { preload: true, key: 'analysis' },
    loadComponent: () => import('./analysis/analysis.component').then(m => m.AnalysisComponent)
  },
  { path: 'monitor', title: '监控页', data: { key: 'monitor' }, loadComponent: () => import('./monitor/monitor.component').then(m => m.MonitorComponent) },
  { path: 'workbench', title: '工作台', data: { key: 'workbench' }, loadComponent: () => import('./workbench/workbench.component').then(m => m.WorkbenchComponent) },
  { path: 'contracts', title: '合約管理', data: { key: 'contracts' }, loadComponent: () => import('./contracts/contracts.component').then(m => m.ContractsComponent) }
] as Route[];
