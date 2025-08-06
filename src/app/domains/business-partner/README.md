# Business Partner Domain

使用 @angular/fire 重新實現的聯絡人管理系統，採用 DDD 架構和極簡主義設計。

## 🏗️ 架構概覽

```
business-partner/
├── domain/           # 領域層 - 核心業務邏輯
├── application/      # 應用層 - 用例協調
├── infrastructure/   # 基礎設施層 - 數據持久化
└── presentation/     # 表現層 - UI 組件
```

## 🎯 核心功能

- ✅ **聯絡人 CRUD 操作**
- ✅ **即時搜尋功能**
- ✅ **狀態管理**
- ✅ **響應式 UI 設計**

## 🔧 技術特色

### 數據持久化
- **@angular/fire Firestore** 集成
- **實時數據同步**
- **自動錯誤處理**

### UI 框架
- **ng-zorro-antd** 組件庫
- **Angular Standalone Components**
- **響應式設計**

### 狀態管理
- **RxJS Observable** 響應式狀態
- **Angular Signals** 現代狀態管理

## 📁 文件結構

### Domain Layer
```
domain/
├── entities/
│   └── contact.entity.ts      # 聯絡人實體
├── value-objects/
│   └── contact-id.vo.ts       # 聯絡人 ID 值對象
└── repositories/
    └── contact.repository.interface.ts  # 倉儲介面
```

### Application Layer
```
application/
├── dto/
│   └── create-contact.dto.ts  # 數據傳輸對象
└── services/
    └── contact.application.service.ts  # 應用服務
```

### Infrastructure Layer
```
infrastructure/
└── repositories/
    └── contact.repository.impl.ts  # Firestore 實現
```

### Presentation Layer
```
presentation/
├── components/
│   └── contact-list.component.ts  # 聯絡人列表組件
└── pages/
    └── contact-manager.component.ts  # 主頁面組件
```

## 🚀 使用方法

### 1. 導入域模組
```typescript
import { ContactManagerComponent } from '@domains/business-partner';
```

### 2. 配置路由
```typescript
{
  path: 'business-partner',
  component: ContactManagerComponent
}
```

### 3. 使用應用服務
```typescript
import { ContactApplicationService } from '@domains/business-partner';

constructor(private contactService: ContactApplicationService) {}

// 獲取所有聯絡人
this.contactService.getAllContacts().subscribe(contacts => {
  console.log(contacts);
});
```

## 🔄 與舊版本對比

| 特性 | 舊版本 (HttpClient) | 新版本 (@angular/fire) |
|------|-------------------|----------------------|
| **數據同步** | 手動請求 | 自動實時同步 |
| **錯誤處理** | 手動處理 | 內建處理 |
| **類型安全** | 手動映射 | 自動類型推斷 |
| **實時更新** | 需要輪詢 | 自動監聽 |
| **複雜度** | 較高 | 較低 |
| **性能** | 中等 | 優化 |

## 📋 開發指南

### 添加新功能
1. 在 `domain/` 中定義實體和業務邏輯
2. 在 `application/` 中實現用例
3. 在 `infrastructure/` 中實現數據訪問
4. 在 `presentation/` 中實現 UI

### 遵循原則
- **極簡主義設計**：避免過度工程
- **清晰邊界**：各層職責明確
- **類型安全**：充分利用 TypeScript
- **響應式編程**：使用 RxJS 和 Signals

## 🎨 UI 組件

### ContactListComponent
- 聯絡人列表顯示
- 即時搜尋功能
- 狀態標籤顯示
- 操作按鈕

### 設計特色
- **現代化界面**：Material Design 風格
- **響應式佈局**：適配多設備
- **視覺化頭像**：自動生成縮寫
- **狀態標籤**：顏色區分狀態

## 🔮 未來計劃

- [ ] **批量操作**：多選刪除/編輯
- [ ] **數據匯入/匯出**：CSV/Excel
- [ ] **聯絡人分類**：標籤管理
- [ ] **活動記錄**：操作歷史
- [ ] **進階搜尋**：篩選器
- [ ] **鍵盤快捷鍵**：提升效率

## 📝 總結

新的 Business Partner Domain 實現了：

1. **完整的 CRUD 功能**
2. **實時數據同步**
3. **現代化 UI 設計**
4. **DDD 架構實踐**
5. **@angular/fire 集成**
6. **Angular 最佳實踐**

該域已經可以**立即使用**，並且具有良好的**擴展性**和**維護性**。
