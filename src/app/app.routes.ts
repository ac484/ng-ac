/**
 * @fileoverview ?�用路由?�置檔�? (Application Routes)
 * @description 定義?�用程�??��??�路?��??��??�括?�面導航?�懶?��??�置
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔�??�質�?
 * - 類�?：Interface Layer Routing
 * - ?�責：路?��?置、�??��??�、�?件懶?��?
 * - 依賴：Angular Router, ?�面組件
 * - 不可變更：此?�件?��??�註�???��?說�??��??��???
 *
 * ?��?說�?�?
 * - 此�?案只存放路由?�置，�??�含業�??�輯
 * - ?�?�新?�面必�??�此檔�?中註?�路??
 * - 使用?��?載�??��??�用?�能
 * - ?��?欄�?件全局?�用?��?證�??��???
 */

import { Routes } from '@angular/router';

export const routes: Routes = [
	// ?��??�到?��??�面
	{
		path: '',
		redirectTo: '/auth/login',
		pathMatch: 'full'
	},

	// 認�??��?路由（使?��?證�?局，無?��?欄�?
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

	// 主應用路由使用 MainApp 佈局容器 + 認證守衛
	{
		path: 'app',
		loadComponent: () => import('./interface/layouts/main-app').then(m => m.MainAppLayoutComponent),
		canActivate: [
			() => import('./interface/guards').then(m => m.AuthGuard)
		],
		children: [
					// 空白?�面
			{
				path: 'blank',
				loadComponent: () => import('./interface/pages/blank').then(m => m.BlankPageComponent)
			},

			// ?�表板
			{
				path: 'dashboard',
				loadComponent: () => import('./interface/pages/dashboard').then(m => m.DashboardPageComponent)
			},


			// ?�場作業?�報�?
			{ path: 'calendars', loadComponent: () => import('./interface/pages/construction/calendars').then(m => m.CalendarsPageComponent) },



			{ path: 'daily-reports', loadComponent: () => import('./interface/pages/construction/daily-reports').then(m => m.DailyReportsPageComponent) },
			{ path: 'log', loadComponent: () => import('./interface/pages/construction/log').then(m => m.LogPageComponent) },
			{ path: 'schedules', loadComponent: () => import('./interface/pages/construction/schedules').then(m => m.SchedulesPageComponent) },
			{ path: 'weather-reports', loadComponent: () => import('./interface/pages/construction/weather-reports').then(m => m.WeatherReportsPageComponent) },
			{ path: 'task', loadComponent: () => import('./interface/pages/construction/task').then(m => m.TaskPageComponent) },

			// 專�?管�?


			{ path: 'inventory', loadComponent: () => import('./interface/pages/assignment/inventory').then(m => m.InventoryPageComponent) },
			{ path: 'equipment', loadComponent: () => import('./interface/pages/assignment/equipment').then(m => m.EquipmentPageComponent) },
			{ path: 'quality-control', loadComponent: () => import('./interface/pages/assignment/quality-control').then(m => m.QualityControlPageComponent) },
			{ path: 'documents', loadComponent: () => import('./interface/pages/assignment/documents').then(m => m.DocumentsPageComponent) },

			// ?�戶管�?
			{
				path: 'users',
				loadComponent: () => import('./interface/pages/people/user/user-list').then(m => m.UserListPageComponent)
			},
			{ path: 'personnel', loadComponent: () => import('./interface/pages/people/personnel').then(m => m.PersonnelPageComponent) },
			{ path: 'attendance', loadComponent: () => import('./interface/pages/people/attendance').then(m => m.AttendancePageComponent) },
			{ path: 'partners', loadComponent: () => import('./interface/pages/people/partners').then(m => m.PartnersPageComponent) },

			// ?��?資�?
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

			// ??��
			{
				path: 'monitoring',
				loadComponent: () => import('./interface/pages/security/monitoring/monitoring.page').then(m => m.MonitoringPageComponent)
			},

			// 安全
			{
				path: 'security',
				loadComponent: () => import('./interface/pages/security/security/security.page').then(m => m.SecurityPageComponent)
			},
			{ path: 'safety', loadComponent: () => import('./interface/pages/security/safety').then(m => m.SafetyPageComponent) },
			{ path: 'incident-reports', loadComponent: () => import('./interface/pages/security/incident-reports').then(m => m.IncidentReportsPageComponent) },

			// 財�?管�?
			{ path: 'budget', loadComponent: () => import('./interface/pages/finance/budget').then(m => m.BudgetPageComponent) },
			{ path: 'expenses', loadComponent: () => import('./interface/pages/finance/expenses').then(m => m.ExpensesPageComponent) },
			{ path: 'payments', loadComponent: () => import('./interface/pages/finance/payments').then(m => m.PaymentsPageComponent) },
			{ path: 'financial-reports', loadComponent: () => import('./interface/pages/finance/financial-reports').then(m => m.FinancialReportsPageComponent) },

			// ?��??��?


			{ path: 'analytics/performance', loadComponent: () => import('./interface/pages/analytics/performance').then(m => m.AnalyticsPerformancePageComponent) },
			{ path: 'analytics/costs', loadComponent: () => import('./interface/pages/analytics/costs').then(m => m.AnalyticsCostsPageComponent) },
			{ path: 'analytics/reports', loadComponent: () => import('./interface/pages/analytics/reports').then(m => m.AnalyticsReportsPageComponent) },

			// 系統設�?
			{ path: 'settings/system', loadComponent: () => import('./interface/pages/settings/system').then(m => m.SettingsSystemPageComponent) },
			{ path: 'settings/permissions', loadComponent: () => import('./interface/pages/settings/permissions').then(m => m.SettingsPermissionsPageComponent) },
			{ path: 'settings/notifications', loadComponent: () => import('./interface/pages/settings/notifications').then(m => m.SettingsNotificationsPageComponent) },
			{ path: 'settings/backup', loadComponent: () => import('./interface/pages/settings/backup').then(m => m.SettingsBackupPageComponent) },

			// ?��?
			{ path: 'state-machine', loadComponent: () => import('./interface/pages/people/state-machine').then(m => m.StateMachinePageComponent) },

			// ?��??�到?�表板
			{
				path: '',
				redirectTo: 'blank',
				pathMatch: 'full'
			}
		]
	},

	// 404 ?�面
	{
		path: '**',
		redirectTo: '/auth/login'
	}
];
