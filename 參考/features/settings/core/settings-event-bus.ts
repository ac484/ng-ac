// 獨立的事件總線系統，用於設置變更通知
// 使用 Observer Pattern 實現，完全獨立於其他模塊

export interface SettingsChangeEvent {
  type: 'sidebar-visibility' | 'sidebar-structure' | 'theme' | 'language' | 'notifications';
  payload: any;
  timestamp: number;
}

export interface SettingsEventListener {
  (event: SettingsChangeEvent): void;
}

export class SettingsEventBus {
  private static instance: SettingsEventBus;
  private listeners: Map<string, SettingsEventListener[]> = new Map();
  private globalListeners: SettingsEventListener[] = [];

  private constructor() {}

  public static getInstance(): SettingsEventBus {
    if (!SettingsEventBus.instance) {
      SettingsEventBus.instance = new SettingsEventBus();
    }
    return SettingsEventBus.instance;
  }

  // 訂閱特定類型的設置變更
  public subscribe(eventType: string, listener: SettingsEventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }

    this.listeners.get(eventType)!.push(listener);

    // 返回取消訂閱的函數
    return () => {
      const eventListeners = this.listeners.get(eventType);
      if (eventListeners) {
        const index = eventListeners.indexOf(listener);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    };
  }

  // 訂閱所有設置變更
  public subscribeToAll(listener: SettingsEventListener): () => void {
    this.globalListeners.push(listener);

    return () => {
      const index = this.globalListeners.indexOf(listener);
      if (index > -1) {
        this.globalListeners.splice(index, 1);
      }
    };
  }

  // 發布設置變更事件
  public publish(event: Omit<SettingsChangeEvent, 'timestamp'>): void {
    const fullEvent: SettingsChangeEvent = {
      ...event,
      timestamp: Date.now()
    };

    // 通知特定類型的監聽器
    const eventListeners = this.listeners.get(event.type);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(fullEvent);
        } catch (error) {
          console.error('Error in settings event listener:', error);
        }
      });
    }

    // 通知全局監聽器
    this.globalListeners.forEach(listener => {
      try {
        listener(fullEvent);
      } catch (error) {
        console.error('Error in global settings event listener:', error);
      }
    });
  }

  // 發布側邊欄可見性變更
  public publishSidebarVisibilityChange(itemId: string, isVisible: boolean): void {
    this.publish({
      type: 'sidebar-visibility',
      payload: { itemId, isVisible }
    });
  }

  // 發布側邊欄結構變更
  public publishSidebarStructureChange(items: any[]): void {
    this.publish({
      type: 'sidebar-structure',
      payload: { items }
    });
  }

  // 清理所有監聽器
  public clear(): void {
    this.listeners.clear();
    this.globalListeners = [];
  }
}

// 導出單例實例
export const settingsEventBus = SettingsEventBus.getInstance();
