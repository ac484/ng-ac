# Firebase + React Query 設置指南

## 🚀 為什麼選擇 React Query + Firebase？

### **性能優勢**
- **智能緩存**: 減少 Firestore 讀取次數，節省成本
- **實時同步**: 自動管理 Firestore 實時監聽器
- **樂觀更新**: 立即更新 UI，提升用戶體驗
- **離線支持**: 與 Firebase 離線持久化完美配合

### **開發體驗**
- **類型安全**: 完整的 TypeScript 支持
- **自動重試**: 智能錯誤處理和重試機制
- **開發工具**: 內建 React Query DevTools
- **測試友好**: 易於模擬和測試

## 📦 安裝依賴

```bash
# 安裝核心依賴
yarn add firebase @tanstack/react-query

# 安裝 Firebase React Query 適配器
yarn add @tanstack-query-firebase/react

# 安裝 Firebase 相關工具
yarn add @tanstack-query-firebase/firestore
```

## ⚙️ 配置 Firebase

### 1. 創建 Firebase 配置文件

```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
```

### 2. 配置 React Query Provider

```typescript
// src/providers/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 分鐘
      gcTime: 1000 * 60 * 10,   // 10 分鐘
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 3. 環境變量配置

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🔥 Firestore 安全規則

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 合約集合規則
    match /contracts/{contractId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        request.auth.uid == resource.data.createdBy;
      allow delete: if request.auth != null &&
        request.auth.uid == resource.data.createdBy;
    }

    // 付款子集合規則
    match /contracts/{contractId}/payments/{paymentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // 變更單子集合規則
    match /contracts/{contractId}/changeOrders/{orderId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## 📊 數據結構設計

### 合約文檔結構

```typescript
interface ContractDocument {
  id: string;
  name: string;
  contractor: string;
  client: string;
  startDate: Timestamp;
  endDate: Timestamp;
  totalValue: number;
  status: 'Active' | 'Completed' | 'On Hold' | 'Terminated';
  scope: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string; // 用戶 ID
  versions: ContractVersion[];

  // 子集合引用
  payments: Payment[];
  changeOrders: ChangeOrder[];
}
```

### 索引配置

```json
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionId": "contracts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "mode": "ASCENDING" },
        { "fieldPath": "createdAt", "mode": "DESCENDING" }
      ]
    },
    {
      "collectionId": "contracts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "contractor", "mode": "ASCENDING" },
        { "fieldPath": "createdAt", "mode": "DESCENDING" }
      ]
    },
    {
      "collectionId": "contracts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "client", "mode": "ASCENDING" },
        { "fieldPath": "createdAt", "mode": "DESCENDING" }
      ]
    }
  ]
}
```

## 🎯 使用示例

### 基本查詢

```typescript
import { useContracts } from '@/features/contracts/hooks';

function ContractsList() {
  const { data: contracts, isLoading, error } = useContracts();

  if (isLoading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error.message}</div>;

  return (
    <div>
      {contracts?.map(contract => (
        <div key={contract.id}>{contract.name}</div>
      ))}
    </div>
  );
}
```

### 狀態過濾

```typescript
import { useContractsByStatus } from '@/features/contracts/hooks';

function ActiveContracts() {
  const { data: activeContracts } = useContractsByStatus('Active');

  return (
    <div>
      {activeContracts?.map(contract => (
        <div key={contract.id}>{contract.name}</div>
      ))}
    </div>
  );
}
```

### 創建合約

```typescript
import { useCreateContract } from '@/features/contracts/hooks';

function CreateContractForm() {
  const createContract = useCreateContract();

  const handleSubmit = (data: ContractFormData) => {
    createContract.mutate(data, {
      onSuccess: () => {
        // 表單重置或其他操作
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 表單內容 */}
      <button
        type="submit"
        disabled={createContract.isPending}
      >
        {createContract.isPending ? '創建中...' : '創建合約'}
      </button>
    </form>
  );
}
```

## 🚀 性能優化建議

### 1. 查詢優化
- 使用 `limit()` 限制結果數量
- 實現分頁加載
- 避免在客戶端進行大量數據過濾

### 2. 緩存策略
- 設置適當的 `staleTime` 和 `gcTime`
- 使用 `select` 函數轉換數據格式
- 實現樂觀更新提升用戶體驗

### 3. 實時監聽
- 只在需要時啟用實時監聽
- 使用 `useCollectionQuery` 自動管理訂閱
- 實現智能的連接管理

## 🔧 開發工具

### React Query DevTools
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// 在開發環境中啟用
{process.env.NODE_ENV === 'development' && (
  <ReactQueryDevtools initialIsOpen={false} />
)}
```

### Firebase Emulator
```bash
# 啟動本地開發環境
firebase emulators:start

# 連接應用
firebase use --add
```

## 📈 監控和分析

### 性能指標
- 查詢響應時間
- 緩存命中率
- 網絡請求次數
- 用戶交互延遲

### 成本優化
- 監控 Firestore 讀取次數
- 優化查詢結構
- 實現智能緩存策略
- 使用離線持久化

## 🎉 總結

使用 React Query + Firebase 的組合可以：
1. **大幅提升性能** - 智能緩存和樂觀更新
2. **改善開發體驗** - 類型安全和開發工具
3. **降低運營成本** - 減少不必要的 Firestore 讀取
4. **提升用戶體驗** - 即時響應和離線支持

這個組合是目前 Firebase 應用的最佳實踐，強烈推薦使用！
