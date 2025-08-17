# 獨立設置模塊使用說明

## 概述

這個設置模塊使用 **Observer Pattern** 和 **Bridge Pattern** 設計，完全獨立於其他模塊，只通過事件總線通信。可以在不修改現有側邊欄的情況下實現功能。

## 架構設計

### 1. Observer Pattern (觀察者模式)
- **事件總線**: `SettingsEventBus` 負責發布和訂閱設置變更事件
- **鬆耦合**: 設置系統和側邊欄之間通過事件通信，不直接依賴

### 2. Bridge Pattern (橋接模式)
- **抽象**: `SettingsManager` 定義設置管理的抽象接口
- **實現**: `LocalStorageSettingsStorage` 提供具體的存儲實現
- **可擴展**: 可以輕鬆添加其他存儲實現（如 API、IndexedDB 等）

### 3. 模塊化設計
- **核心模塊**: `core/` 包含所有核心邏輯
- **適配器**: `adapters/` 提供與現有系統的適配
- **增強器**: `enhancers/` 提供 HOC 模式的增強功能

## 使用方法

### 1. 基本使用

```tsx
import { useIndependentSettings } from '@/features/settings/hooks/use-independent-settings';

function MyComponent() {
  const { state, updateSidebarVisibility, saveSettings } = useIndependentSettings();

  return (
    <div>
      {/* 使用設置狀態 */}
    </div>
  );
}
```

### 2. 側邊欄增強器

```tsx
import { SidebarEnhancer } from '@/features/settings/enhancers/sidebar-enhancer';

function App() {
  return (
    <SidebarEnhancer>
      {/* 你的應用組件 */}
    </SidebarEnhancer>
  );
}
```

### 3. 事件監聽

```tsx
import { settingsEventBus } from '@/features/settings/core/settings-event-bus';

// 訂閱設置變更事件
const unsubscribe = settingsEventBus.subscribe('sidebar-visibility', (event) => {
  console.log('側邊欄可見性變更:', event.payload);
});

// 清理訂閱
unsubscribe();
```

## 文件結構

```
src/features/settings/
├── core/                          # 核心模塊
│   ├── settings-event-bus.ts     # 事件總線
│   └── settings-manager.ts       # 設置管理器
├── hooks/                         # React Hooks
│   └── use-independent-settings.ts
├── adapters/                      # 適配器
│   └── sidebar-adapter.tsx
├── enhancers/                     # 增強器
│   └── sidebar-enhancer.tsx
├── components/                    # UI 組件
│   └── independent-sidebar-settings.tsx
└── README.md                      # 使用說明
```

## 主要特性

### 1. 完全獨立
- 不依賴於現有的 Context 或 Provider
- 可以單獨使用和測試
- 樣式依然可以引用現有 UI 組件

### 2. 事件驅動
- 使用事件總線進行通信
- 支持多個監聽器
- 自動清理訂閱，避免內存洩漏

### 3. 類型安全
- 完整的 TypeScript 類型定義
- 編譯時錯誤檢查
- 智能提示和自動完成

### 4. 可擴展
- 支持多種存儲方式
- 可以輕鬆添加新的設置類型
- 支持插件式架構

## 事件類型

### sidebar-visibility
側邊欄項目可見性變更事件

```typescript
{
  type: 'sidebar-visibility',
  payload: { itemId: string, isVisible: boolean },
  timestamp: number
}
```

### sidebar-structure
側邊欄結構變更事件

```typescript
{
  type: 'sidebar-structure',
  payload: { items: SidebarItemSettings[] },
  timestamp: number
}
```

## 最佳實踐

### 1. 組件設計
- 使用 `useIndependentSettings` Hook 獲取設置狀態
- 通過事件總線發布設置變更
- 使用 `SidebarEnhancer` 包裝需要設置功能的組件

### 2. 性能優化
- 使用 `useCallback` 和 `useMemo` 優化函數和計算
- 及時清理事件訂閱
- 避免不必要的重新渲染

### 3. 錯誤處理
- 使用 try-catch 包裝異步操作
- 提供用戶友好的錯誤信息
- 記錄錯誤日誌用於調試

## 擴展指南

### 1. 添加新的存儲實現

```typescript
export class APISettingsStorage implements ISettingsStorage {
  async load(): Promise<Partial<SettingsState>> {
    // 從 API 加載設置
  }

  async save(settings: SettingsState): Promise<void> {
    // 保存設置到 API
  }
}
```

### 2. 添加新的設置類型

```typescript
export interface SettingsState {
  // 現有設置...
  newSettings: NewSettingsType;
}
```

### 3. 添加新的事件類型

```typescript
export interface SettingsChangeEvent {
  type: 'sidebar-visibility' | 'sidebar-structure' | 'new-event-type';
  payload: any;
  timestamp: number;
}
```

## 故障排除

### 1. 設置不生效
- 檢查事件訂閱是否正確
- 確認設置已保存到存儲
- 檢查控制台錯誤信息

### 2. 內存洩漏
- 確保在組件卸載時清理事件訂閱
- 使用 `useEffect` 的清理函數
- 檢查是否有循環引用

### 3. 類型錯誤
- 確認 TypeScript 配置正確
- 檢查導入路徑是否正確
- 更新類型定義文件

## 總結

這個獨立設置模塊提供了一個靈活、可擴展的解決方案，可以在不修改現有代碼的情況下添加設置功能。通過使用設計模式和事件驅動架構，實現了模塊間的鬆耦合，提高了代碼的可維護性和可測試性。
