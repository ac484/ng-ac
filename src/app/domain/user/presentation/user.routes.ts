import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/user-management/user-management.component').then(m => m.UserManagementComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/user-create/user-create.component').then(m => m.UserCreateComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/user-detail/user-detail.component').then(m => m.UserDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/user-edit/user-edit.component').then(m => m.UserEditComponent)
  }
];
