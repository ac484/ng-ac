# 合約管理模組

這是一個完全自有化的合約管理功能模組，提供完整的合約生命週期管理。

## 功能特性

- 📊 **合約儀表板**: 顯示合約統計數據和概覽
- 📋 **合約列表**: 管理所有合約，支持查看、編輯、刪除
- 🔍 **合約詳情**: 詳細的合約信息，包括付款、變更單、版本歷史
- ✨ **AI 摘要**: 智能合約文檔摘要功能
- ➕ **合約表單**: 創建和編輯合約的完整表單
- 📈 **實時統計**: 動態統計數據更新

## 模組結構

```
src/features/contracts/
├── components/           # React 組件
│   ├── contract-logo.tsx           # 合約模組 Logo
│   ├── contract-dashboard-stats.tsx # 儀表板統計
│   ├── contracts-table.tsx         # 合約列表表格
│   ├── contract-details-sheet.tsx  # 合約詳情側邊欄
│   ├── contract-ai-summarizer.tsx  # AI 摘要對話框
│   ├── contract-form.tsx           # 合約創建/編輯表單
│   └── index.ts                   # 組件導出
├── hooks/               # React Hooks
│   ├── use-contracts.ts            # 合約管理 Hook
│   └── index.ts                   # Hooks 導出
├── services/            # 業務邏輯服務
│   ├── contract-service.ts         # 合約服務類
│   └── index.ts                   # 服務導出
├── types.ts             # TypeScript 類型定義
├── index.ts             # 模組主導出
└── README.md            # 模組說明文檔
```

## 使用方法

### 基本導入

```typescript
import {
  ContractLogo,
  ContractDashboardStats,
  ContractsTable,
  ContractDetailsSheet,
  ContractAiSummarizer,
  ContractForm
} from '@/features/contracts/components';

import {
  useContracts,
  useContractStats,
  useContract
} from '@/features/contracts/hooks';

import { ContractService } from '@/features/contracts/services';
```

### 使用 Hooks

```typescript
// 獲取所有合約
const { contracts, loading, error, createContract, updateContract, deleteContract } = useContracts();

// 獲取統計數據
const { stats, loading } = useContractStats();

// 獲取單個合約
const { contract, loading } = useContract(contractId);
```

### 使用服務

```typescript
// 獲取所有合約
const contracts = await ContractService.getAllContracts();

// 創建新合約
const newContract = await ContractService.createContract(contractData);

// 更新合約
const updatedContract = await ContractService.updateContract(id, updates);
```

## 組件說明

### ContractLogo
合約模組的專用 Logo 組件，包含圖標和文字。

### ContractDashboardStats
顯示合約統計數據的儀表板組件，包括：
- 總合約數
- 進行中合約
- 已完成合約
- 合約總價值

### ContractsTable
合約列表表格組件，支持：
- 合約信息展示
- 狀態標籤
- 操作選單（查看、編輯、刪除）
- CSV 匯出功能

### ContractDetailsSheet
合約詳情側邊欄組件，包含：
- 基本合約信息
- 付款追蹤
- 變更單管理
- 版本歷史

### ContractAiSummarizer
AI 合約摘要組件，支持：
- 文件上傳
- AI 摘要生成
- 結果展示

### ContractForm
合約創建/編輯表單組件，包含：
- 合約基本信息
- 日期選擇
- 狀態管理
- 工作範圍描述

## 類型定義

### Contract
```typescript
interface Contract {
  id: string;
  name: string;
  contractor: string;
  client: string;
  startDate: Date;
  endDate: Date;
  totalValue: number;
  status: 'Active' | 'Completed' | 'On Hold' | 'Terminated';
  scope: string;
  payments: Payment[];
  changeOrders: ChangeOrder[];
  versions: ContractVersion[];
}
```

### Payment
```typescript
interface Payment {
  id: string;
  amount: number;
  requestDate: Date;
  status: 'Paid' | 'Pending' | 'Overdue';
  paidDate?: Date;
}
```

### ChangeOrder
```typescript
interface ChangeOrder {
  id: string;
  title: string;
  date: Date;
  status: 'Approved' | 'Pending' | 'Rejected';
  impact: {
    cost: number;
    schedule: number;
  };
}
```

## 自定義配置

### 狀態配置
可以在 `types.ts` 中修改合約狀態選項：
```typescript
type ContractStatus = 'Active' | 'Completed' | 'On Hold' | 'Terminated';
```

### 服務配置
可以在 `contract-service.ts` 中修改服務邏輯，例如：
- 替換模擬數據為實際 API 調用
- 添加數據驗證邏輯
- 實現緩存機制

## 擴展功能

### 添加新的合約字段
1. 在 `types.ts` 中添加新字段
2. 在 `contract-form.tsx` 中添加表單控件
3. 在 `contract-details-sheet.tsx` 中顯示新字段
4. 在 `contract-service.ts` 中處理新字段

### 添加新的操作
1. 在 `contract-service.ts` 中添加新方法
2. 在 `use-contracts.ts` 中添加新的 Hook 邏輯
3. 在相關組件中調用新功能

## 注意事項

- 目前使用模擬數據，生產環境需要替換為實際 API
- AI 摘要功能需要實現實際的 AI 服務集成
- 文件上傳功能需要配置適當的文件大小限制和類型驗證
- 建議添加適當的錯誤處理和用戶反饋機制

## 技術棧

- **React 18**: 使用最新的 React 特性
- **TypeScript**: 完整的類型安全
- **Tailwind CSS**: 現代化的樣式系統
- **Shadcn/ui**: 高質量的 UI 組件庫
- **Lucide Icons**: 一致的圖標系統
