import { SettingsState, SidebarItemSettings } from '../types';

const SETTINGS_STORAGE_KEY = 'ac-beta-settings';
const DEFAULT_LANGUAGE = 'zh-TW';

export class SettingsService {
  private static instance: SettingsService;
  private defaultSettings: SettingsState;

  private constructor() {
    this.defaultSettings = this.createDefaultSettings();
  }

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  private createDefaultSettings(): SettingsState {
    return {
      sidebarSettings: {
        items: [
          {
            id: 'overview',
            title: '概覽',
            url: '/dashboard/overview',
            icon: 'dashboard',
            isVisible: true,
            isCollapsible: false,
            children: []
          },
          {
            id: 'core-business',
            title: '核心業務',
            url: '#',
            icon: 'billing',
            isVisible: true,
            isCollapsible: true,
            children: [
              {
                id: 'display-panel',
                title: '顯示面板',
                url: '/dashboard/display-panel',
                icon: 'dashboard',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'projects',
                title: '專案',
                url: '/dashboard/projects',
                icon: 'page',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'products',
                title: '產品🚧',
                url: '/dashboard/products',
                icon: 'product',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'inventory',
                title: '庫存🚧',
                url: '/dashboard/inventory',
                icon: 'page',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'sales',
                title: '銷售🚧',
                url: '/dashboard/sales',
                icon: 'arrowRight',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'customers',
                title: '客戶🚧',
                url: '/dashboard/customers',
                icon: 'user',
                isVisible: true,
                isCollapsible: false
              }
            ]
          },
          {
            id: 'partners',
            title: '合作夥伴',
            url: '/dashboard/partners',
            icon: 'user2',
            isVisible: true,
            isCollapsible: true,
            children: [
              {
                id: 'partners-dashboard',
                title: '儀表板',
                url: '/dashboard/partners?view=dashboard',
                icon: 'dashboard',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'partners-list',
                title: '合作夥伴',
                url: '/dashboard/partners?view=partners',
                icon: 'user',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'partners-workflows',
                title: '工作流程',
                url: '/dashboard/partners?view=workflows',
                icon: 'settings',
                isVisible: true,
                isCollapsible: false
              }
            ]
          },
          {
            id: 'operations',
            title: '營運',
            url: '#',
            icon: 'settings',
            isVisible: true,
            isCollapsible: true,
            children: [
              {
                id: 'operations-projects',
                title: '專案',
                url: '/dashboard/projects',
                icon: 'page',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'contracts',
                title: '合約',
                url: '/dashboard/contracts',
                icon: 'post',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'documents',
                title: '文件',
                url: '/dashboard/documents',
                icon: 'page',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'workflows',
                title: '工作流程🚧',
                url: '/dashboard/workflows',
                icon: 'kanban',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'kanban',
                title: '看板',
                url: '/dashboard/kanban',
                icon: 'kanban',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'timeline',
                title: '時間軸🚧',
                url: '/dashboard/timeline',
                icon: 'dashboard',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'quality',
                title: '品質🚧',
                url: '/dashboard/quality',
                icon: 'check',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'issues',
                title: '問題🚧',
                url: '/dashboard/issues',
                icon: 'warning',
                isVisible: true,
                isCollapsible: false
              }
            ]
          },
          {
            id: 'management',
            title: '管理',
            url: '#',
            icon: 'billing',
            isVisible: true,
            isCollapsible: true,
            children: [
              {
                id: 'hr',
                title: '人力資源🚧',
                url: '/dashboard/hr',
                icon: 'user',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'finance',
                title: '財務🚧',
                url: '/dashboard/finance',
                icon: 'billing',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'reports',
                title: '報表🚧',
                url: '/dashboard/reports',
                icon: 'dashboard',
                isVisible: true,
                isCollapsible: false
              }
            ]
          },
          {
            id: 'communication',
            title: '通訊',
            url: '#',
            icon: 'post',
            isVisible: true,
            isCollapsible: true,
            children: [
              {
                id: 'messages',
                title: '訊息🚧',
                url: '/dashboard/messages',
                icon: 'post',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'notifications',
                title: '通知🚧',
                url: '/dashboard/notifications',
                icon: 'warning',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'announcements',
                title: '公告🚧',
                url: '/dashboard/announcements',
                icon: 'post',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'knowledge',
                title: '知識庫🚧',
                url: '/dashboard/knowledge',
                icon: 'page',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'logbook',
                title: '日誌🚧',
                url: '/dashboard/logbook',
                icon: 'page',
                isVisible: true,
                isCollapsible: false
              }
            ]
          },
          {
            id: 'analytics-tools',
            title: '分析與工具',
            url: '#',
            icon: 'dashboard',
            isVisible: true,
            isCollapsible: true,
            children: [
              {
                id: 'analytics',
                title: '分析🚧',
                url: '/dashboard/analytics',
                icon: 'dashboard',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'calendar',
                title: '行事曆🚧',
                url: '/dashboard/calendar',
                icon: 'dashboard',
                isVisible: true,
                isCollapsible: false
              }
            ]
          },
          {
            id: 'account',
            title: '帳戶',
            url: '#',
            icon: 'user',
            isVisible: true,
            isCollapsible: true,
            children: [
              {
                id: 'profile',
                title: '個人資料',
                url: '/dashboard/profile',
                icon: 'userPen',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'sign-in',
                title: '登入',
                url: '/dashboard/sign-in',
                icon: 'login',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'settings',
                title: '設定🚧',
                url: '/dashboard/settings',
                icon: 'settings',
                isVisible: true,
                isCollapsible: false
              }
            ]
          },
          {
            id: 'public',
            title: '公開',
            url: '#',
            icon: 'logo',
            isVisible: true,
            isCollapsible: true,
            children: [
              {
                id: 'about',
                title: '關於🚧',
                url: '/public/about',
                icon: 'help',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'blog',
                title: '部落格🚧',
                url: '/public/blog',
                icon: 'post',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'careers',
                title: '職缺🚧',
                url: '/public/careers',
                icon: 'user',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'case-studies',
                title: '案例研究🚧',
                url: '/public/case-studies',
                icon: 'post',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'contact',
                title: '聯絡我們🚧',
                url: '/public/contact',
                icon: 'help',
                isVisible: true,
                isCollapsible: false
              },
              {
                id: 'legal',
                title: '法律🚧',
                url: '/public/legal',
                icon: 'post',
                isVisible: true,
                isCollapsible: false
              }
            ]
          }
        ],
        version: '1.0.0',
        lastUpdated: new Date().toISOString()
      },
      userPreferences: {
        sidebarSettings: {
          items: [],
          version: '1.0.0',
          lastUpdated: new Date().toISOString()
        },
        theme: 'system',
        language: DEFAULT_LANGUAGE,
        notifications: {
          email: true,
          push: true,
          inApp: true
        }
      },
      isLoading: false,
      error: null
    };
  }

  public async loadSettings(): Promise<SettingsState> {
    try {
      if (typeof window === 'undefined') {
        return this.defaultSettings;
      }

      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!stored) {
        return this.defaultSettings;
      }

      const parsed = JSON.parse(stored);
      return this.mergeWithDefaults(parsed);
    } catch (error) {
      console.error('Failed to load settings:', error);
      return this.defaultSettings;
    }
  }

  public async saveSettings(settings: SettingsState): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      const settingsToSave = {
        ...settings,
        sidebarSettings: {
          ...settings.sidebarSettings,
          lastUpdated: new Date().toISOString()
        }
      };

      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }

  private mergeWithDefaults(stored: Partial<SettingsState>): SettingsState {
    return {
      ...this.defaultSettings,
      ...stored,
      sidebarSettings: {
        ...this.defaultSettings.sidebarSettings,
        ...stored.sidebarSettings,
        items: this.mergeSidebarItems(
          this.defaultSettings.sidebarSettings.items,
          stored.sidebarSettings?.items || []
        )
      }
    };
  }

  private mergeSidebarItems(defaultItems: SidebarItemSettings[], storedItems: SidebarItemSettings[]): SidebarItemSettings[] {
    return defaultItems.map(defaultItem => {
      const storedItem = storedItems.find(item => item.id === defaultItem.id);
      if (storedItem) {
        return {
          ...defaultItem,
          isVisible: storedItem.isVisible,
          children: defaultItem.children ? this.mergeSidebarItems(defaultItem.children, storedItem.children || []) : undefined
        };
      }
      return defaultItem;
    });
  }

  public getDefaultSettings(): SettingsState {
    return this.createDefaultSettings();
  }
}
