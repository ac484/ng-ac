import { Routes } from '@angular/router';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { UserSettingsComponent } from './pages/user-settings/user-settings.component';
import { userResolver } from './resolvers/user.resolver';
import { userExistsGuard } from './guards/user-exists.guard';

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    data: { title: 'User Management' },
    title: 'User Management'
  },
  {
    path: 'profile/:id',
    component: UserProfileComponent,
    data: { title: 'User Profile' },
    canActivate: [userExistsGuard],
    resolve: {
      user: userResolver
    },
    title: 'User Profile'
  },
  {
    path: 'settings',
    component: UserSettingsComponent,
    data: { title: 'User Settings' },
    title: 'User Settings'
  }
];
