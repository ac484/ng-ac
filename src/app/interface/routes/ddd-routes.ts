import { Routes } from '@angular/router';
import { authSimpleCanActivate, authSimpleCanActivateChild } from '@delon/auth';

import { PRINCIPAL_ROUTES } from './principal-routes';
import { AnonymousLoginComponent } from '../components/auth/anonymous-login.component';
import { CallbackComponent } from '../components/auth/callback.component';
import { EmailLoginComponent } from '../components/auth/email-login.component';
import { GoogleAuthComponent } from '../components/auth/google-auth.component';
import { UserLockComponent } from '../components/auth/lock.component';
import { UserLoginComponent } from '../components/auth/login.component';
import { UserRegisterResultComponent } from '../components/auth/register-result.component';
import { UserRegisterComponent } from '../components/auth/register.component';
import { DashboardComponent } from '../components/dashboard.component';
import { LayoutBasicComponent } from '../components/layout/basic.component';
import { LayoutPassportComponent } from '../components/layout/passport/passport.component';
import { WelcomeComponent } from '../components/welcome.component';
import { ExceptionComponent } from '../components/exception/exception.component';
import { ExceptionTriggerComponent } from '../components/exception/trigger.component';
import { startPageGuard } from '../guards/start-page.guard';

export const dddRoutes: Routes = [
  // Main application routes with authentication
  {
    path: '',
    component: LayoutBasicComponent,
    canActivate: [startPageGuard, authSimpleCanActivate],
    canActivateChild: [authSimpleCanActivateChild],
    data: {},
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      // DDD Architecture Routes
      {
        path: 'accounts',
        loadComponent: () => import('../components/account-list.component').then(m => m.AccountListComponent),
        title: '帳戶管理'
      },
      {
        path: 'transactions',
        loadComponent: () => import('../components/transaction-list.component').then(m => m.TransactionListComponent),
        title: '交易管理'
      },
      {
        path: 'users',
        loadComponent: () => import('../components/user-list.component').then(m => m.UserListComponent),
        title: '用戶管理'
      },
      {
        path: 'contracts',
        children: [
          {
            path: '',
            loadComponent: () => import('../components/contract/contract-list.component').then(m => m.ContractListComponent),
            title: '合約管理'
          },
          {
            path: 'create',
            loadComponent: () => import('../components/contract/contract-form.component').then(m => m.ContractFormComponent),
            title: '新增合約'
          },
          {
            path: ':id',
            loadComponent: () => import('../components/contract/contract-detail.component').then(m => m.ContractDetailComponent),
            title: '合約詳情'
          },
          {
            path: ':id/edit',
            loadComponent: () => import('../components/contract/contract-form.component').then(m => m.ContractFormComponent),
            title: '編輯合約'
          }
        ]
      },
      {
        path: 'pro/account/center',
        loadComponent: () => import('../components/account-center.component').then(m => m.AccountCenterComponent),
        title: '個人中心'
      },
      {
        path: 'pro/account/settings',
        loadComponent: () => import('../components/account-settings.component').then(m => m.AccountSettingsComponent),
        title: '個人設置'
      },
      // Principal Routes
      ...PRINCIPAL_ROUTES
    ]
  },
  // Passport routes (authentication)
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      {
        path: 'login',
        component: UserLoginComponent,
        data: { title: '登录', titleI18n: 'app.login.login' }
      },
      {
        path: 'register',
        component: UserRegisterComponent,
        data: { title: '注册', titleI18n: 'app.register.register' }
      },
      {
        path: 'register-result',
        component: UserRegisterResultComponent,
        data: { title: '注册结果', titleI18n: 'app.register.register' }
      },
      {
        path: 'lock',
        component: UserLockComponent,
        data: { title: '锁屏', titleI18n: 'app.lock' }
      },
      {
        path: 'google-auth',
        component: GoogleAuthComponent,
        data: { title: 'Google 登入', titleI18n: 'app.google.login' }
      },
      {
        path: 'email-login',
        component: EmailLoginComponent,
        data: { title: '郵箱登入', titleI18n: 'app.email.login' }
      },
      {
        path: 'anonymous-login',
        component: AnonymousLoginComponent,
        data: { title: '匿名登入', titleI18n: 'app.anonymous.login' }
      }
    ]
  },
  // Single page without layout
  { path: 'passport/callback/:type', component: CallbackComponent },
  // Welcome page
  { path: 'welcome', component: WelcomeComponent },
  // Exception routes
  { path: 'exception/403', component: ExceptionComponent, data: { type: 403 } },
  { path: 'exception/404', component: ExceptionComponent, data: { type: 404 } },
  { path: 'exception/500', component: ExceptionComponent, data: { type: 500 } },
  { path: 'exception/trigger', component: ExceptionTriggerComponent },
  // Catch all route
  { path: '**', redirectTo: 'exception/404' }
];
