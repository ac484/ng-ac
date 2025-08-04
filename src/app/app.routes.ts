import { Routes } from '@angular/router';

export const routes: Routes = [
  // DDD Routes - 主要應用路由
  {
    path: '',
    loadChildren: () => import('./interface/routes/ddd-routes').then(m => m.dddRoutes)
  }
];
