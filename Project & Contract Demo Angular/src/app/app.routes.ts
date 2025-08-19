/**
 * @ai-context {
 *   "role": "Infrastructure/Config",
 *   "purpose": "應用路由配置-現代化路由定義",
 *   "constraints": ["懶載入", "類型安全", "SEO友好"],
 *   "dependencies": [],
 *   "security": "medium",
 *   "lastmod": "2025-08-19"
 * }
 * @usage provideRouter(routes)
 * @see docs/architecture/routing.md
 */
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('./interface/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./interface/pages/dashboard/dashboard.page').then(m => m.DashboardPage),
        title: 'Dashboard - Project & Contract Demo'
      },
      {
        path: 'projects',
        loadComponent: () => import('./interface/pages/projects/projects.page').then(m => m.ProjectsPage),
        title: 'Projects - Project & Contract Demo'
      },

      {
        path: 'contracts',
        loadComponent: () => import('./interface/pages/contracts/contracts.page').then(m => m.ContractsPageComponent),
        title: 'Contracts - Project & Contract Demo'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
