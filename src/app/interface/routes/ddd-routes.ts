import { Routes } from '@angular/router';
import { authJWTCanActivate } from '@delon/auth';
import { LoginComponent } from '../../presentation/passport/login/login.component';

export const dddRoutes: Routes = [
  {
    path: 'passport/login',
    component: LoginComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('../../presentation/passport/login-form/login-form.component').then(m => m.LoginFormComponent)
      }
    ]
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