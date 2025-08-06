import { Routes } from '@angular/router';
import { authJWTCanActivate } from '@delon/auth';
import { MainLayoutComponent } from './shared/presentation/layout/main-layout/main-layout.component';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./domain/auth/presentation/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authJWTCanActivate],
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                loadChildren: () => import('./domain/dashboard/presentation/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
            },
            {
                path: 'users',
                loadChildren: () => import('./domain/user/presentation/user.routes').then(m => m.USER_ROUTES)
            },
        ]
    }
];
