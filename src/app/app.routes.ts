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
  // Basic layout routes (using ng-alain standard layout)
  {
    path: '',
    canActivate: [authJWTCanActivate],
    loadComponent: () => import('./presentation/layout/basic/basic.component').then(m => m.LayoutBasicComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./presentation/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./presentation/user/user-list/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./presentation/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  }
];
