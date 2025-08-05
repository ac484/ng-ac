import { Routes } from '@angular/router';
import { authJWTCanActivate } from '@delon/auth';

export const routes: Routes = [
  // Passport routes
  {
    path: 'passport/login',
    loadComponent: () => import('./presentation/passport/login/login.component').then(m => m.LoginComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./presentation/passport/login-form/login-form.component').then(m => m.LoginFormComponent)
      }
    ]
  },
  {
    path: 'passport/register',
    loadComponent: () => import('./presentation/passport/register/register.component').then(m => m.RegisterComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./presentation/passport/register-form/register-form.component').then(m => m.RegisterFormComponent)
      }
    ]
  },
  {
    path: 'passport/callback',
    loadComponent: () => import('./presentation/passport/callback/callback.component').then(m => m.CallbackComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authJWTCanActivate],
    loadComponent: () => import('./presentation/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  }
];
