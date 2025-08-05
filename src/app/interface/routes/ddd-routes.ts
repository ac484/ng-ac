import { Routes } from '@angular/router';
import { authJWTCanActivate } from '@delon/auth';

export const dddRoutes: Routes = [
  {
    path: 'passport/login',
    loadComponent: () => import('../../presentation/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authJWTCanActivate],
    loadComponent: () => import('../../presentation/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  }
]; 