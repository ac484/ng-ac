import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AnalysisComponent } from './pages/analysis/analysis.component';
import { MonitorComponent } from './pages/monitor/monitor.component';
import { WorkplaceComponent } from './pages/workplace/workplace.component';
import { ThemeDemoComponent } from './pages/theme-demo/theme-demo.component';
import { tabGuard } from '../../../shared/infrastructure/guards/tab.guard';

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: DashboardComponent,
        data: { title: 'Dashboard' },
        canActivate: [tabGuard]
    },
    {
        path: 'analysis',
        component: AnalysisComponent,
        data: { title: '分析頁', key: 'dashboard-analysis' },
        canActivate: [tabGuard]
    },
    {
        path: 'monitor',
        component: MonitorComponent,
        data: { title: '監控頁', key: 'dashboard-monitor' },
        canActivate: [tabGuard]
    },
    {
        path: 'workplace',
        component: WorkplaceComponent,
        data: { title: '工作臺', key: 'dashboard-workplace' },
        canActivate: [tabGuard]
    },
    {
        path: 'theme-demo',
        component: ThemeDemoComponent,
        data: { title: '主題演示', key: 'dashboard-theme-demo' },
        canActivate: [tabGuard]
    }
];
