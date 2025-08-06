import { Routes } from '@angular/router';
import { AuthGuard } from './shared/infrastructure/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./domain/auth/presentation/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./domain/dashboard/presentation/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadChildren: () => import('./domain/user/presentation/user.routes').then(m => m.USER_ROUTES)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
