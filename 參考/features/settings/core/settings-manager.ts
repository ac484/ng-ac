// 獨立的設置管理器，使用 Bridge Pattern 分離邏輯
// 完全獨立於其他模塊，只通過事件總線通信

import { settingsEventBus } from './settings-event-bus';

export interface SidebarItemSettings {
  id: string;
  title: string;
  url: string;
  icon?: string;
  isVisible: boolean;
  isCollapsible: boolean;
  children?: SidebarItemSettings[];
}

export interface SidebarSettings {
  items: SidebarItemSettings[];
  version: string;
  lastUpdated: string;
}

export interface UserPreferences {
  sidebarSettings: SidebarSettings;
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}

export interface SettingsState {
  sidebarSettings: SidebarSettings;
  userPreferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
}

// 設置存儲接口 - Bridge Pattern 的實現部分
export interface ISettingsStorage {
  load(): Promise<Partial<SettingsState>>;
  save(settings: SettingsState): Promise<void>;
}

// 本地存儲實現
export class LocalStorageSettingsStorage implements ISettingsStorage {
  private readonly storageKey = 'ac-beta-settings';

  async load(): Promise<Partial<SettingsState>> {
    try {
      if (typeof window === 'undefined') {
        return {};
      }

      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        return {};
      }

      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
      return {};
    }
  }

  async save(settings: SettingsState): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      localStorage.setItem(this.storageKey, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
      throw error;
    }
  }
}

// 設置管理器 - Bridge Pattern 的抽象部分
export class SettingsManager {
  private static instance: SettingsManager;
  private storage: ISettingsStorage;
  private state: SettingsState;
  private defaultSettings: SettingsState;

  private constructor(storage: ISettingsStorage) {
    this.storage = storage;
    this.defaultSettings = this.createDefaultSettings();
    this.state = { ...this.defaultSettings };
  }

  public static getInstance(storage?: ISettingsStorage): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager(storage || new LocalStorageSettingsStorage());
    }
    return SettingsManager.instance;
  }

  // 獲取當前設置狀態
  public getState(): SettingsState {
    return { ...this.state };
  }

  // 加載設置
  public async loadSettings(): Promise<void> {
    try {
      this.state.isLoading = true;
      this.state.error = null;

      const stored = await this.storage.load();
      this.state = this.mergeWithDefaults(stored);

      // 發布設置加載完成事件
      settingsEventBus.publish({
        type: 'sidebar-structure',
        payload: { items: this.state.sidebarSettings.items }
      });
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Failed to load settings';
      throw error;
    } finally {
      this.state.isLoading = false;
    }
  }

  // 保存設置
  public async saveSettings(): Promise<void> {
    try {
      this.state.isLoading = true;
      this.state.error = null;

      await this.storage.save(this.state);

      // 發布設置保存完成事件
      settingsEventBus.publish({
        type: 'sidebar-structure',
        payload: { items: this.state.sidebarSettings.items }
      });
    } catch (error) {
      this.state.error = error instanceof Error ? error.message : 'Failed to save settings';
      throw error;
    } finally {
      this.state.isLoading = false;
    }
  }

  // 更新側邊欄項目可見性
  public updateSidebarVisibility(itemId: string, isVisible: boolean): void {
    const updateItemVisibility = (items: SidebarItemSettings[]): SidebarItemSettings[] => {
      return items.map(item => {
        if (item.id === itemId) {
          return { ...item, isVisible };
        }
        if (item.children) {
          return { ...item, children: updateItemVisibility(item.children) };
        }
        return item;
      });
    };

    this.state.sidebarSettings.items = updateItemVisibility(this.state.sidebarSettings.items);
    this.state.sidebarSettings.lastUpdated = new Date().toISOString();

    // 發布可見性變更事件
    settingsEventBus.publishSidebarVisibilityChange(itemId, isVisible);
  }

  // 重置為默認設置
  public resetToDefaults(): void {
    this.state = { ...this.defaultSettings };

    // 發布重置事件
    settingsEventBus.publish({
      type: 'sidebar-structure',
      payload: { items: this.state.sidebarSettings.items }
    });
  }

  // 獲取可見的側邊欄項目
  public getVisibleSidebarItems(): SidebarItemSettings[] {
    const filterVisible = (items: SidebarItemSettings[]): SidebarItemSettings[] => {
      return items
        .filter(item => item.isVisible)
        .map(item => ({
          ...item,
          children: item.children ? filterVisible(item.children) : undefined
        }));
    };

    return filterVisible(this.state.sidebarSettings.items);
  }

  // 創建默認設置
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
        language: 'zh-TW',
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

  // 合併存儲的設置與默認設置
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

  // 合併側邊欄項目
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
}
