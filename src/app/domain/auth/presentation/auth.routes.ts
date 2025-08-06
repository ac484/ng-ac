import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login/login.component';
import { RegisterPageComponent } from './pages/register/register.component';
import { ForgotPasswordPageComponent } from './pages/forgot-password/forgot-password.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    title: 'Login'
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    title: 'Register'
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordPageComponent,
    title: 'Forgot Password'
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
