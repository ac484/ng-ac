import { Routes } from '@angular/router';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';
import { userResolver } from './resolvers/user.resolver';
import { userExistsGuard } from './guards/user-exists.guard';
import { tabGuard } from '../../../shared/infrastructure/guards/tab.guard';

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    data: { title: 'User Management' },
    canActivate: [tabGuard],
    title: 'User Management'
  },
  {
    path: 'profile/:id',
    component: UserProfileComponent,
    data: { title: 'User Profile' },
    canActivate: [userExistsGuard, tabGuard],
    resolve: {
      user: userResolver
    },
    title: 'User Profile'
  },
  {
    path: 'settings',
    component: UserSettingsComponent,
    data: { title: 'User Settings' },
    canActivate: [tabGuard],
    title: 'User Settings'
  }
];
