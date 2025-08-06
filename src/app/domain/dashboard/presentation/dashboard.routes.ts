import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { tabGuard } from '../../../shared/infrastructure/guards/tab.guard';

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: DashboardComponent,
        data: { title: 'Dashboard' },
        canActivate: [tabGuard]
    }
];
