/**
 * @fileoverview 應用路由配置檔案 (Application Routes)
 * @description 定義應用程式的所有路由規則，包括頁面導航和懶加載配置
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Routing
 * - 職責：路由配置、頁面導航、組件懶加載
 * - 依賴：Angular Router, 頁面組件
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案只存放路由配置，不包含業務邏輯
 * - 所有新頁面必須在此檔案中註冊路由
 * - 使用懶加載來優化應用性能
 * - 側邊欄組件全局應用於認證後的頁面
 */

import { Routes } from '@angular/router';

export const routes: Routes = [
	// 重定向到登錄頁面
	{
		path: '',
		redirectTo: '/auth/login',
		pathMatch: 'full'
	},

	// 認證相關路由（使用認證佈局，無側邊欄）
	{
		path: 'auth',
		loadComponent: () => import('./interface/layouts/passport').then(m => m.PassportLayoutComponent),
		children: [
			{
				path: 'login',
				loadComponent: () => import('./interface/pages/auth/login').then(m => m.LoginPageComponent)
			},
			{
				path: 'register',
				loadComponent: () => import('./interface/pages/auth/register').then(m => m.RegisterPageComponent)
			}
		]
	},

	// 主應用路由（使用 MainApp 佈局容器 + 認證守衛）
	{
		path: 'app',
		loadComponent: () => import('./interface/layouts/main-app').then(m => m.MainAppLayoutComponent),
		canActivate: [
			() => import('./security/authentication/guards').then(m => m.AuthGuard)
		],
		children: [
			// 儀表板
			{
				path: 'dashboard',
				loadComponent: () => import('./interface/pages/dashboard').then(m => m.DashboardPageComponent)
			},

			// 現場作業與報表
			{ path: 'calendars', loadComponent: () => import('./interface/pages/construction/calendars').then(m => m.CalendarsPageComponent) },
			{ path: 'construction-reports', loadComponent: () => import('./interface/pages/construction/construction-reports').then(m => m.ConstructionReportsPageComponent) },
			{ path: 'contract', loadComponent: () => import('./interface/pages/assignment/contract').then(m => m.ContractPageComponent) },
			{ path: 'daily-reports', loadComponent: () => import('./interface/pages/construction/daily-reports').then(m => m.DailyReportsPageComponent) },
			{ path: 'log', loadComponent: () => import('./interface/pages/construction/log').then(m => m.LogPageComponent) },
			{ path: 'schedules', loadComponent: () => import('./interface/pages/schedules').then(m => m.SchedulesPageComponent) },
			{ path: 'weather-reports', loadComponent: () => import('./interface/pages/construction/weather-reports').then(m => m.WeatherReportsPageComponent) },
			{ path: 'task', loadComponent: () => import('./interface/pages/construction/task').then(m => m.TaskPageComponent) },

			// 用戶管理
			{
				path: 'users',
				loadComponent: () => import('./interface/pages/user/user-list').then(m => m.UserListPageComponent)
			},

			// 公開資訊
			{
				path: 'public',
				children: [
					{ path: 'about', loadComponent: () => import('./interface/pages/public/about/about.page').then(m => m.PublicAboutPageComponent) },
					{ path: 'blog', loadComponent: () => import('./interface/pages/public/blog/blog.page').then(m => m.PublicBlogPageComponent) },
					{ path: 'jobs', loadComponent: () => import('./interface/pages/public/jobs/jobs.page').then(m => m.PublicJobsPageComponent) },
					{ path: 'cases', loadComponent: () => import('./interface/pages/public/cases/cases.page').then(m => m.PublicCasesPageComponent) },
					{ path: 'contact', loadComponent: () => import('./interface/pages/public/contact/contact.page').then(m => m.PublicContactPageComponent) },
					{ path: 'legal', loadComponent: () => import('./interface/pages/public/legal/legal.page').then(m => m.PublicLegalPageComponent) }
				]
			},

			// 監控
			{
				path: 'monitoring',
				loadComponent: () => import('./interface/pages/monitoring/monitoring.page').then(m => m.MonitoringPageComponent)
			},

			// 安全
			{
				path: 'security',
				loadComponent: () => import('./interface/pages/security/security/security.page').then(m => m.SecurityPageComponent)
			},

			// 重定向到儀表板
			{
				path: '',
				redirectTo: 'dashboard',
				pathMatch: 'full'
			}
		]
	},

	// 404 頁面
	{
		path: '**',
		redirectTo: '/auth/login'
	}
];
