# 合約管理模組

## 概述

這是一個基於DDD（Domain-Driven Design）架構的合約管理系統，使用@angular/fire與Firestore進行數據交互，並採用ng-zorro-antd作為UI組件庫。

## 架構結構

```
src/app/domains/contract-management/
├── domain/                    # 領域層
│   ├── entities/             # 實體
│   │   └── contract.entity.ts
│   └── repositories/         # 倉儲接口
│       └── contract.repository.ts
├── infrastructure/           # 基礎設施層
│   └── repositories/        # 倉儲實現
│       └── firestore-contract.repository.ts
├── application/             # 應用層
│   └── services/           # 應用服務
│       └── contract.service.ts
├── presentation/            # 表現層
│   └── pages/             # 頁面組件
│       ├── contract-list/
│       ├── contract-create/
│       ├── contract-detail/
│       └── contract-edit/
└── contract-management.providers.ts  # 依賴注入配置
```

## 功能特性

### 合約實體
- **編號** (contractNumber): 合約唯一編號
- **合約名稱** (contractName): 合約名稱
- **客戶公司** (clientCompany): 客戶公司名稱
- **客戶代表** (clientRepresentative): 客戶代表姓名
- **總金額** (totalAmount): 合約總金額
- **創建時間** (createdAt): 記錄創建時間
- **更新時間** (updatedAt): 記錄最後更新時間

### 核心功能
1. **合約列表** - 顯示所有合約，支持分頁和搜索
2. **新增合約** - 創建新的合約記錄
3. **查看詳情** - 查看合約詳細信息
4. **編輯合約** - 修改現有合約信息
5. **刪除合約** - 刪除合約記錄

## 技術實現

### DDD架構
- **Domain層**: 定義業務實體和倉儲接口
- **Infrastructure層**: 實現數據訪問，使用Firestore
- **Application層**: 處理業務邏輯和用例
- **Presentation層**: UI組件和用戶交互

### 依賴注入
使用Angular的依賴注入系統，通過InjectionToken實現接口與實現的解耦：

```typescript
export const CONTRACT_REPOSITORY = new InjectionToken<ContractRepository>('ContractRepository');
```

### Firestore集成
- 使用@angular/fire的最新API
- 實時數據同步
- 自動生成的文檔ID
- 時間戳自動管理

### UI組件
- 使用ng-zorro-antd組件庫
- 響應式設計
- 表單驗證
- 用戶友好的錯誤提示

## 路由配置

```typescript
{
  path: 'contract-management',
  children: [
    { path: '', component: ContractListComponent },
    { path: 'create', component: ContractCreateComponent }
  ]
}
```

## 使用方式

1. **訪問合約列表**: `/dashboard/contract-management`
2. **新增合約**: `/dashboard/contract-management/create`
3. **查看合約**: `/dashboard/contract-management/{id}`
4. **編輯合約**: `/dashboard/contract-management/{id}/edit`

## 開發規範

### 極簡主義設計
- 避免過度工程化
- 專注核心業務邏輯
- 利用ng-zorro-antd組件，避免自造輪子
- 保持清晰的模組邊界

### 代碼質量
- 每次生成後立即檢查邏輯正確性
- 確保符合預期流程與業務規則
- 避免錯誤累積

### 架構原則
- 清晰的層級分離
- 依賴倒置原則
- 單一職責原則
- 開閉原則

## 擴展性

該架構具有良好的擴展性，可以輕鬆添加：
- 新的業務實體
- 不同的數據源
- 新的UI頁面
- 複雜的業務邏輯

## 測試

建議為以下層級添加測試：
- Domain層：實體和業務規則測試
- Application層：服務邏輯測試
- Infrastructure層：數據訪問測試
- Presentation層：組件測試
