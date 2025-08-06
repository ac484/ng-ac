import { Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/presentation/layout/main-layout/main-layout.component';
import { tabGuard } from './shared/infrastructure/guards/tab.guard';
import { firebaseAuthGuard } from './shared/infrastructure/guards/firebase-auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./domain/auth/presentation/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [firebaseAuthGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'dashboard'
            },
            {
                path: 'dashboard',
                data: { title: 'Dashboard' },
                canActivate: [tabGuard],
                loadChildren: () => import('./domain/dashboard/presentation/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
            },
            {
                path: 'users',
                data: { title: 'Users' },
                canActivate: [tabGuard],
                loadChildren: () => import('./domain/user/presentation/user.routes').then(m => m.USER_ROUTES)
            },
        ]
    }
];
