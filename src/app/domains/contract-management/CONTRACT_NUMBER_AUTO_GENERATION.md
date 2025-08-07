# 合約編號自動生成功能

## 🎯 功能概述

合約編號現在會自動生成，格式為：**YYYYMMDDHHMM** (年+月+日+時分)，並且這個編號也作為 Firebase 文檔的文件名稱。

## 📋 實現細節

### 1. 合約編號格式

**格式**：`YYYYMMDDHHMM`
- **YYYY**：年份 (4位)
- **MM**：月份 (2位，01-12)
- **DD**：日期 (2位，01-31)
- **HH**：小時 (2位，00-23)
- **MM**：分鐘 (2位，00-59)

**示例**：
- `202412011430` = 2024年12月01日14時30分
- `202412011431` = 2024年12月01日14時31分

### 2. 核心組件

#### 工具函數 (`contract-number.utils.ts`)
```typescript
// 生成合約編號
export function generateContractNumber(date: Date = new Date()): string

// 驗證合約編號格式
export function isValidContractNumber(contractNumber: string): boolean

// 解析合約編號為日期
export function parseContractNumberToDate(contractNumber: string): Date

// 格式化合約編號顯示
export function formatContractNumber(contractNumber: string): string
```

#### 合約實體類 (`contract.entity.ts`)
```typescript
// 合約創建屬性
export interface CreateContractProps {
  contractName: string;
  contractType: ContractType;
  // ... 其他屬性
}

// 合約實體類
export class ContractEntity {
  static create(props: CreateContractProps): Contract
}
```

### 3. 自動生成流程

#### 新增合約流程
1. **用戶填寫表單**：用戶只需要填寫合約名稱、客戶信息等，不需要輸入合約編號
2. **自動生成編號**：系統使用 `ContractEntity.create()` 自動生成合約編號
3. **Firebase 存儲**：使用合約編號作為文檔 ID 存儲到 Firestore
4. **用戶反饋**：成功後顯示生成的合約編號

#### 編輯合約流程
1. **保留原編號**：編輯時保留原有的合約編號
2. **更新其他字段**：只更新除編號外的其他字段
3. **保持 ID 不變**：Firebase 文檔 ID 保持不變

### 4. Firebase 文檔結構

```typescript
// 文檔 ID = 合約編號
{
  id: "202412011430",           // 文檔 ID (合約編號)
  contractNumber: "202412011430", // 合約編號
  contractName: "服務合約",
  contractType: "service",
  // ... 其他字段
  createdAt: "2024-12-01T14:30:00.000Z",
  updatedAt: "2024-12-01T14:30:00.000Z"
}
```

## 🎨 用戶界面

### 新增合約頁面
- **移除合約編號輸入欄位**：用戶不再需要手動輸入合約編號
- **添加提示信息**：顯示"合約編號將自動生成"的提示
- **格式說明**：顯示編號格式為 YYYYMMDDHHMM

### 合約列表頁面
- **格式化顯示**：合約編號顯示為 `2024-12-01 14:30` 格式
- **工具提示**：滑鼠懸停顯示完整的合約編號
- **搜索功能**：支持通過合約編號搜索

## 🔧 技術實現

### 1. 自動生成邏輯
```typescript
private static generateContractNumber(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}${month}${day}${hour}${minute}`;
}
```

### 2. Firebase 存儲
```typescript
async create(contract: Contract): Promise<string> {
  // 使用合約編號作為文檔 ID
  const contractDoc = doc(this.firestore, this.collectionName, contract.contractNumber);
  
  const contractWithTimestamps = {
    ...contract,
    id: contract.contractNumber, // 確保 ID 字段存在
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  await setDoc(contractDoc, contractWithTimestamps);
  return contract.contractNumber;
}
```

### 3. 表單處理
```typescript
// 新增模式：使用 CreateContractProps
const createProps: CreateContractProps = {
  contractName: formValue.contractName,
  contractType: formValue.contractType,
  // ... 其他屬性
};

// 使用 ContractEntity.create 來創建合約
const contract = ContractEntity.create(createProps);
```

## 📊 優勢

### 1. 用戶體驗
- **簡化操作**：用戶不需要記住或輸入合約編號
- **避免重複**：自動生成確保編號唯一性
- **即時反饋**：創建成功後立即顯示編號

### 2. 數據一致性
- **唯一性保證**：基於時間戳的編號確保唯一性
- **可追溯性**：編號包含創建時間信息
- **文件管理**：編號直接作為文件名稱

### 3. 系統維護
- **自動化**：減少人工錯誤
- **標準化**：統一的編號格式
- **可擴展**：支持未來格式調整

## 🚀 使用示例

### 創建新合約
```typescript
// 1. 用戶填寫表單
const formData = {
  contractName: "網站開發服務",
  contractType: ContractType.SERVICE,
  clientCompany: "ABC公司",
  // ... 其他字段
};

// 2. 系統自動生成合約
const contract = ContractEntity.create(formData);
// 結果：contract.contractNumber = "202412011430"

// 3. 存儲到 Firebase
await contractRepository.create(contract);
// Firebase 文檔 ID = "202412011430"
```

### 顯示合約編號
```typescript
// 原始編號：202412011430
// 顯示格式：2024-12-01 14:30
const displayNumber = formatContractNumber("202412011430");
// 結果：displayNumber = "2024-12-01 14:30"
```

## 🔮 未來擴展

### 1. 編號格式擴展
- 支持自定義前綴
- 支持部門代碼
- 支持年度重置

### 2. 驗證增強
- 檢查編號衝突
- 支持批量生成
- 歷史編號查詢

### 3. 顯示優化
- 支持不同顯示格式
- 支持多語言
- 支持自定義樣式

## 📝 總結

合約編號自動生成功能成功實現了：

1. **自動化生成**：基於時間戳的智能編號生成
2. **用戶友好**：簡化的表單操作和清晰的提示
3. **數據一致性**：編號作為文件名稱，確保唯一性
4. **可維護性**：標準化的格式和驗證機制

這個功能大大提升了合約管理系統的用戶體驗和數據管理效率。
