/**
 * @fileoverview 動態導航服務：從路由自動生成側邊欄導航
 * @description 掃描 Router 配置，根據路徑/規則/元資料生成 `SidebarItem[]`
 */
import { Injectable, signal } from '@angular/core';
import { Route, Router, Routes } from '@angular/router';
import { SidebarItem } from '@app/shared/interfaces/layout/sidebar.interface';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private readonly _items = signal<SidebarItem[]>([]);

    constructor(private readonly router: Router) {
        const items = this.buildSidebarItemsFromRoutes(this.router.config);
        this._items.set(items);
    }

    /** 只讀的側邊欄項目清單 */
    readonly navigationItems = this._items.asReadonly();

    // ---- 內部：規則與對照表 ----
    private readonly GROUP_TITLES: Record<string, string> = {
        main: '主要功能',
        analytics: '分析',
        construction: '工程管理',
        finance: '財務管理',
        people: '人員管理',
        public: '公共頁面',
        security: '安全'
    };

    private readonly GROUP_ICONS: Record<string, string> = {
        analytics: 'analytics',
        construction: 'construction',
        finance: 'account_balance',
        people: 'group',
        public: 'public',
        security: 'security'
    };

    /** 群組顯示順序（main-flat 先行，其餘依此順序呈現） */
    private readonly GROUP_ORDER: string[] = [
        'analytics',
        'construction',
        'finance',
        'people',
        'public',
        'security'
    ];

    private readonly LABELS: Record<string, string> = {
        dashboard: '儀表板',
        // analytics
        performance: '效能分析',
        costs: '成本分析',
        reports: '報表',
        // construction
        calendars: '日曆',
        'daily-reports': '日報',
        log: '日誌',
        schedules: '排程管理',
        task: '任務管理',
        // assignment
        inventory: '庫存',
        equipment: '設備',
        'quality-control': '品質管制',
        documents: '文件',
        // people
        users: '用戶列表',
        personnel: '人員管理',
        attendance: '考勤管理',
        partners: '合作夥伴',
        'state-machine': '狀態機',
        // finance
        budget: '預算管理',
        expenses: '費用管理',
        payments: '付款管理',
        'financial-reports': '財務報告',
        // public
        about: '關於我們',
        blog: '部落格',
        jobs: '職缺資訊',
        cases: '案例展示',
        contact: '聯絡我們',
        legal: '法律條款',
        // security
        monitoring: '監控',
        safety: '安全',
        'incident-reports': '事故報告',
        security: '安全中心'
    };

    private readonly ICONS: Record<string, string> = {
        dashboard: 'dashboard',
        performance: 'speed',
        costs: 'account_balance',
        reports: 'assessment',
        calendars: 'event',
        'daily-reports': 'report',
        log: 'history',
        schedules: 'calendar_today',
        task: 'task',
        inventory: 'inventory_2',
        equipment: 'construction',
        'quality-control': 'rule',
        documents: 'description',
        users: 'list',
        personnel: 'person',
        attendance: 'schedule',
        partners: 'handshake',
        'state-machine': 'device_hub',
        budget: 'account_balance_wallet',
        expenses: 'receipt',
        payments: 'payment',
        'financial-reports': 'assessment',
        about: 'info',
        blog: 'article',
        jobs: 'work',
        cases: 'cases',
        contact: 'contact_support',
        legal: 'gavel',
        monitoring: 'monitor_heart',
        safety: 'shield',
        'incident-reports': 'report_gmailerrorred',
        security: 'security'
    };

    // ---- 內部：構建流程 ----
    private buildSidebarItemsFromRoutes(rootRoutes: Routes): SidebarItem[] {
        const appRoute = rootRoutes.find(r => r.path === 'app');
        if (!appRoute || !appRoute.children) {
            return [];
        }

        // 分組蒐集
        const grouped: Record<string, SidebarItem[]> = {};
        const pushToGroup = (group: string, item: SidebarItem) => {
            if (!grouped[group]) grouped[group] = [];
            grouped[group].push(item);
        };

        // 遍歷 app 子路由
        for (const route of appRoute.children) {
            if (route.path === 'public' && route.children) {
                for (const child of route.children) {
                    const full = this.join('/app/public', child.path);
                    const key = child.path ?? '';
                    pushToGroup('public', this.toItem(key, full));
                }
                continue;
            }

            // analytics/* 作為一組
            if (route.path?.startsWith('analytics/')) {
                const key = route.path.split('/')[1] ?? 'reports';
                const full = this.join('/app', route.path);
                pushToGroup('analytics', this.toItem(key, full));
                continue;
            }

            const group = this.detectGroup(route);
            const full = this.join('/app', route.path ?? '');
            const key = route.path ?? '';

            if (group === 'main') {
                // 直接平鋪到頂層（不包一層 group）
                pushToGroup('main-flat', this.toItem(key, full));
            } else {
                pushToGroup(group, this.toItem(key, full));
            }
        }

        // 組裝最終 SidebarItem[]：先平鋪 main，再各 group 依固定順序呈現
        const result: SidebarItem[] = [];
        if (grouped['main-flat']) {
            result.push(...grouped['main-flat'].sort(this.sortByLabel));
        }

        // 依指定順序加入各群組
        for (const group of this.GROUP_ORDER) {
            const children = grouped[group];
            if (!children || children.length === 0) continue;
            const parent: SidebarItem = {
                id: group,
                title: this.GROUP_TITLES[group] ?? group,
                label: this.GROUP_TITLES[group] ?? group,
                icon: this.GROUP_ICONS[group],
                children: children.sort(this.sortByLabel)
            };
            result.push(parent);
        }

        // 其餘未在指定順序內的群組（若有），按群組名排序後附加
        const remainingGroups = Object.keys(grouped)
            .filter(g => g !== 'main-flat' && !this.GROUP_ORDER.includes(g))
            .sort();
        for (const group of remainingGroups) {
            const children = grouped[group];
            const parent: SidebarItem = {
                id: group,
                title: this.GROUP_TITLES[group] ?? group,
                label: this.GROUP_TITLES[group] ?? group,
                icon: this.GROUP_ICONS[group],
                children: children.sort(this.sortByLabel)
            };
            result.push(parent);
        }

        return result;
    }

    private detectGroup(route: Route): string {
        const p = route.path ?? '';
        if (p === 'dashboard' || p === 'blank') return 'main';
        if (['calendars', 'daily-reports', 'log', 'schedules', 'task'].includes(p)) return 'construction';
        if (['budget', 'expenses', 'payments', 'financial-reports'].includes(p)) return 'finance';
        if (['users', 'personnel', 'attendance', 'partners', 'state-machine'].includes(p)) return 'people';
        if (['monitoring', 'security', 'safety', 'incident-reports'].includes(p)) return 'security';
        return 'main';
    }

    private toItem(key: string, route: string): SidebarItem {
        const title = this.LABELS[key] ?? this.toTitleCase(key);
        return {
            id: key || route,
            title,
            label: title,
            route,
            icon: this.ICONS[key]
        };
    }

    private join(base: string, sub: string | undefined): string {
        const s = (sub ?? '').replace(/^\/+/g, '');
        return `${base}/${s}`.replace(/\/+/, '/');
    }

    private toTitleCase(kebab: string): string {
        return kebab
            .split('-')
            .map(s => (s ? s[0].toUpperCase() + s.slice(1) : s))
            .join(' ');
    }

    private readonly sortByLabel = (a: SidebarItem, b: SidebarItem) => a.label.localeCompare(b.label);
}


