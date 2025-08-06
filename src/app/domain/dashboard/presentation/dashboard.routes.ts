import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AnalysisComponent } from './pages/analysis/analysis.component';
import { MonitorComponent } from './pages/monitor/monitor.component';
import { WorkplaceComponent } from './pages/workplace/workplace.component';

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: DashboardComponent,
        data: { title: 'Dashboard' }
    },
    {
        path: 'analysis',
        component: AnalysisComponent,
        data: { title: '分析頁', key: 'dashboard-analysis' }
    },
    {
        path: 'monitor',
        component: MonitorComponent,
        data: { title: '監控頁', key: 'dashboard-monitor' }
    },
    {
        path: 'workplace',
        component: WorkplaceComponent,
        data: { title: '工作臺', key: 'dashboard-workplace' }
    }
];
