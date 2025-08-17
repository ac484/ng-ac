// 側邊欄增強器 - 使用 Observer Pattern 在不修改現有側邊欄的情況下添加功能
// 這是一個 HOC (Higher-Order Component) 模式的實現

'use client';

import React, { useEffect, useState } from 'react';
import { SettingsChangeEvent, settingsEventBus } from '../core/settings-event-bus';
import { SidebarItemSettings } from '../core/settings-manager';

// 側邊欄增強器 Props
interface SidebarEnhancerProps {
  children: React.ReactNode;
  onSettingsChange?: (visibleItems: SidebarItemSettings[]) => void;
}

// 側邊欄增強器組件
export function SidebarEnhancer({ children, onSettingsChange }: SidebarEnhancerProps) {
  const [visibleItems, setVisibleItems] = useState<SidebarItemSettings[]>([]);

  useEffect(() => {
    // 訂閱設置變更事件
    const unsubscribeStructure = settingsEventBus.subscribe('sidebar-structure', (event: SettingsChangeEvent) => {
      if (event.payload?.items) {
        setVisibleItems(event.payload.items);
        // 通知父組件設置已變更
        onSettingsChange?.(event.payload.items);
      }
    });

    const unsubscribeVisibility = settingsEventBus.subscribe('sidebar-visibility', (event: SettingsChangeEvent) => {
      console.log('Sidebar visibility changed:', event.payload);
      // 當可見性變更時，可以觸發其他邏輯
    });

    return () => {
      unsubscribeStructure();
      unsubscribeVisibility();
    };
  }, [onSettingsChange]);

  // 渲染子組件，並將可見項目作為 context 傳遞
  return (
    <SidebarSettingsContext.Provider value={{ visibleItems }}>
      {children}
    </SidebarSettingsContext.Provider>
  );
}

// 創建 Context 用於傳遞設置數據
interface SidebarSettingsContextType {
  visibleItems: SidebarItemSettings[];
}

const SidebarSettingsContext = React.createContext<SidebarSettingsContextType>({
  visibleItems: []
});

// Hook 用於在子組件中訪問設置數據
export function useSidebarSettings() {
  return React.useContext(SidebarSettingsContext);
}

// 側邊欄項目過濾器 - 用於過濾不可見的項目
export function filterVisibleSidebarItems<T extends { id: string; children?: T[] }>(
  items: T[],
  visibleItems: SidebarItemSettings[]
): T[] {
  return items
    .filter(item => {
      const visibleItem = visibleItems.find(vi => vi.id === item.id);
      return visibleItem?.isVisible !== false;
    })
    .map(item => ({
      ...item,
      children: item.children ? filterVisibleSidebarItems(item.children, visibleItems) : undefined
    }));
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

// 側邊欄增強器 Hook - 用於在現有組件中添加設置功能
export function useSidebarEnhancer() {
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

  return {
    visibleItems,
    filterVisibleItems: (items: any[]) => filterVisibleSidebarItems(items, visibleItems),
    transformToSidebarItems: () => transformSettingsToSidebarItems(visibleItems)
  };
}
