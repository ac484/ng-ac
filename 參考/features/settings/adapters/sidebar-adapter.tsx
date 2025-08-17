// 側邊欄適配器 - 使用 Observer Pattern 監聽設置變更
// 在不修改現有側邊欄的情況下實現功能

'use client';

import { useEffect, useState } from 'react';
import { SettingsChangeEvent, settingsEventBus } from '../core/settings-event-bus';
import { SidebarItemSettings } from '../core/settings-manager';

// 側邊欄適配器組件
export function SidebarAdapter() {
  const [visibleItems, setVisibleItems] = useState<SidebarItemSettings[]>([]);

  useEffect(() => {
    // 訂閱側邊欄結構變更事件
    const unsubscribeStructure = settingsEventBus.subscribe('sidebar-structure', (event: SettingsChangeEvent) => {
      if (event.payload?.items) {
        setVisibleItems(event.payload.items);
      }
    });

    // 訂閱側邊欄可見性變更事件
    const unsubscribeVisibility = settingsEventBus.subscribe('sidebar-visibility', (event: SettingsChangeEvent) => {
      // 當可見性變更時，重新獲取當前設置狀態
      // 這裡可以觸發側邊欄重新渲染
      console.log('Sidebar visibility changed:', event.payload);
    });

    // 清理訂閱
    return () => {
      unsubscribeStructure();
      unsubscribeVisibility();
    };
  }, []);

  // 這個組件不渲染任何 UI，只負責監聽設置變更
  // 可以通過 props 將 visibleItems 傳遞給父組件
  return null;
}

// 側邊欄適配器 Hook
export function useSidebarAdapter() {
  const [visibleItems, setVisibleItems] = useState<SidebarItemSettings[]>([]);

  useEffect(() => {
    const unsubscribeStructure = settingsEventBus.subscribe('sidebar-structure', (event: SettingsChangeEvent) => {
      if (event.payload?.items) {
        setVisibleItems(event.payload.items);
      }
    });

    const unsubscribeVisibility = settingsEventBus.subscribe('sidebar-visibility', (event: SettingsChangeEvent) => {
      console.log('Sidebar visibility changed:', event.payload);
    });

    return () => {
      unsubscribeStructure();
      unsubscribeVisibility();
    };
  }, []);

  return { visibleItems };
}

// 側邊欄項目轉換器 - 將設置格式轉換為側邊欄格式
export function transformSettingsToSidebarItems(settings: SidebarItemSettings[]): any[] {
  return settings
    .filter(item => item.isVisible)
    .map(item => ({
      title: item.title,
      url: item.url,
      icon: item.icon,
      isActive: false,
      shortcut: [],
      items: item.children ? transformSettingsToSidebarItems(item.children) : []
    }));
}
