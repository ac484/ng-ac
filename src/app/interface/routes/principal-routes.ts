import { Routes } from '@angular/router';
import { PrincipalPageComponent } from '../components/principal/principal-page.component';

export const PRINCIPAL_ROUTES: Routes = [
  {
    path: 'principal',
    component: PrincipalPageComponent,
    data: {
      title: 'Principal 管理',
      icon: 'team'
    }
  }
]; 