# 統一模態框服務 (ModalService)

統一模態框服務提供了一套標準化的對話框解決方案，包裝了 ng-zorro-antd 的 modal 功能，提供更簡潔和一致的 API。

## 功能特色

- 🎯 **統一 API**: 提供一致的對話框調用方式
- 🛡️ **錯誤處理**: 內建錯誤處理和用戶友好的錯誤提示
- 🎨 **可重用範本**: 提供標準化的對話框範本組件
- ⚡ **高效能**: 基於 ng-zorro-antd 的高效能實現
- 🔧 **可配置**: 支援豐富的配置選項
- 📱 **響應式**: 支援響應式設計

## 基本使用

### 1. 注入服務

```typescript
import { ModalService } from '../services/modal.service';

@Component({...})
export class MyComponent {
  private readonly modalService = inject(ModalService);
}
```

### 2. 確認對話框

```typescript
// 基本確認
const confirmed = await this.modalService.confirm({
  title: '確認操作',
  content: '您確定要執行此操作嗎？',
  onOk: () => {
    console.log('用戶確認了操作');
  }
});

// 刪除確認
await this.modalService.confirmDelete('項目名稱', () => {
  console.log('執行刪除操作');
});

// 警告確認
await this.modalService.confirmWarning({
  title: '警告',
  content: '此操作可能會影響系統穩定性',
  onOk: () => {
    console.log('執行危險操作');
  }
});
```

### 3. 資訊對話框

```typescript
// 基本資訊
await this.modalService.info({
  title: '系統資訊',
  content: '這是一個資訊提示'
});

// 成功提示
await this.modalService.success('操作成功', '您的操作已成功完成！');

// 錯誤提示
await this.modalService.error('操作失敗', '系統發生錯誤，請稍後再試');

// 警告提示
await this.modalService.warning('注意', '系統將在 5 分鐘後進行維護');
```

### 4. 表單對話框

```typescript
import { FormModalComponent, FormModalData } from '../components/shared/modal-templates';

const formData: FormModalData = {
  title: '用戶資訊',
  fields: [
    {
      key: 'name',
      label: '姓名',
      type: 'text',
      required: true,
      placeholder: '請輸入姓名'
    },
    {
      key: 'email',
      label: '電子郵件',
      type: 'email',
      required: true,
      placeholder: '請輸入電子郵件'
    }
  ]
};

this.modalService.openForm({
  title: formData.title,
  component: FormModalComponent,
  componentParams: { data: formData },
  onOk: (data) => {
    console.log('表單資料:', data);
  }
});
```

### 5. 載入對話框

```typescript
// 基本載入
const modalRef = this.modalService.openLoading({
  title: '載入中',
  content: '正在處理您的請求...'
});

// 3 秒後關閉
setTimeout(() => {
  modalRef.close();
}, 3000);

// 進度載入
const { modalRef, updateProgress, complete } = this.modalService.openProgressLoading('處理資料');

let progress = 0;
const interval = setInterval(() => {
  progress += 10;
  updateProgress(progress, `處理進度: ${progress}%`);
  
  if (progress >= 100) {
    clearInterval(interval);
    complete('處理完成！');
  }
}, 500);
```

## 進階使用

### 自定義對話框

```typescript
import { CustomComponent } from './custom.component';

this.modalService.openCustom({
  title: '自定義對話框',
  content: CustomComponent,
  componentParams: { data: customData },
  width: 800,
  onOk: () => {
    console.log('自定義操作');
  }
});
```

### 連續對話框

```typescript
async showChainedModals(): Promise<void> {
  const step1 = await this.modalService.confirm({
    title: '步驟 1',
    content: '這是第一個步驟，確定要繼續嗎？'
  });

  if (!step1) return;

  await this.modalService.info({
    title: '步驟 2',
    content: '第一步完成，現在進入第二步'
  });

  const step3 = await this.modalService.confirm({
    title: '步驟 3',
    content: '這是最後一步，確定要完成嗎？'
  });

  if (step3) {
    await this.modalService.success('完成', '所有步驟已完成！');
  }
}
```

## 預設配置

### 常用表單欄位

```typescript
import { CommonFormFields } from '../components/shared/modal-templates';

// 使用預設的用戶欄位
const userFields = [
  CommonFormFields.user.name,
  CommonFormFields.user.email,
  CommonFormFields.user.phone
];

// 使用預設的交易欄位
const transactionFields = [
  CommonFormFields.transaction.amount,
  CommonFormFields.transaction.currency,
  CommonFormFields.transaction.description
];
```

### 常用確認對話框

```typescript
import { CommonConfirmations } from '../components/shared/modal-templates';

// 使用預設的刪除確認
const deleteConfirmation = CommonConfirmations.delete('用戶資料');

// 使用預設的登出確認
const logoutConfirmation = CommonConfirmations.logout();
```

### 常用載入配置

```typescript
import { CommonLoadings } from '../components/shared/modal-templates';

// 使用預設的儲存載入
const savingModal = this.modalService.openCustom({
  content: LoadingModalComponent,
  componentParams: { data: CommonLoadings.saving }
});
```

## API 參考

### ConfirmModalOptions

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| title | string | - | 對話框標題 |
| content | string | - | 對話框內容 |
| okText | string | '確定' | 確定按鈕文字 |
| cancelText | string | '取消' | 取消按鈕文字 |
| okType | string | 'primary' | 確定按鈕類型 |
| okDanger | boolean | false | 確定按鈕是否為危險樣式 |
| width | string\|number | 416 | 對話框寬度 |
| maskClosable | boolean | false | 點擊遮罩是否關閉 |
| keyboard | boolean | true | 是否支援鍵盤 ESC 關閉 |
| centered | boolean | false | 是否垂直居中 |
| icon | string | 'question-circle' | 圖示類型 |
| onOk | Function | - | 確定回調函數 |
| onCancel | Function | - | 取消回調函數 |

### FormModalOptions

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| title | string | - | 表單標題 |
| component | Type<any> | - | 表單組件 |
| componentParams | any | - | 組件參數 |
| width | string\|number | 600 | 對話框寬度 |
| maskClosable | boolean | false | 點擊遮罩是否關閉 |
| keyboard | boolean | true | 是否支援鍵盤 ESC 關閉 |
| centered | boolean | true | 是否垂直居中 |
| okText | string | '確定' | 確定按鈕文字 |
| cancelText | string | '取消' | 取消按鈕文字 |
| okLoading | boolean | false | 確定按鈕載入狀態 |
| onOk | Function | - | 確定回調函數 |
| onCancel | Function | - | 取消回調函數 |

### LoadingModalOptions

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| title | string | '處理中' | 載入標題 |
| content | string | - | 載入內容 |
| maskClosable | boolean | false | 點擊遮罩是否關閉 |
| keyboard | boolean | false | 是否支援鍵盤 ESC 關閉 |
| centered | boolean | true | 是否垂直居中 |

## 最佳實踐

### 1. 錯誤處理

```typescript
try {
  await this.modalService.confirm({
    title: '確認操作',
    content: '執行此操作',
    onOk: async () => {
      // 可能拋出錯誤的操作
      await this.dangerousOperation();
    }
  });
} catch (error) {
  // 錯誤會自動顯示給用戶
  console.error('操作失敗:', error);
}
```

### 2. 載入狀態管理

```typescript
async performLongOperation(): Promise<void> {
  const loadingModal = this.modalService.openLoading({
    title: '處理中',
    content: '正在執行操作，請稍候...'
  });

  try {
    await this.longRunningOperation();
    loadingModal.close();
    await this.modalService.success('成功', '操作已完成');
  } catch (error) {
    loadingModal.close();
    await this.modalService.error('失敗', '操作執行失敗');
  }
}
```

### 3. 表單驗證

```typescript
const formData: FormModalData = {
  title: '用戶註冊',
  fields: [
    {
      key: 'email',
      label: '電子郵件',
      type: 'email',
      required: true,
      validators: [Validators.email]
    },
    {
      key: 'password',
      label: '密碼',
      type: 'password',
      required: true,
      minLength: 8,
      errorMessage: '密碼至少需要 8 個字元'
    }
  ]
};
```

### 4. 響應式設計

```typescript
// 根據螢幕大小調整對話框寬度
const isMobile = window.innerWidth < 768;
const modalWidth = isMobile ? '90%' : 600;

this.modalService.openForm({
  title: '表單',
  component: FormModalComponent,
  width: modalWidth
});
```

## 注意事項

1. **記憶體管理**: 確保在組件銷毀時關閉所有打開的對話框
2. **無障礙功能**: 對話框支援鍵盤導航和螢幕閱讀器
3. **效能考量**: 避免同時打開過多對話框
4. **用戶體驗**: 提供清晰的操作回饋和錯誤訊息

## 故障排除

### 常見問題

1. **對話框不顯示**: 檢查是否正確注入了 ModalService
2. **表單驗證失效**: 確保表單欄位配置正確
3. **樣式問題**: 檢查 ng-zorro-antd 樣式是否正確載入
4. **記憶體洩漏**: 確保在適當時機關閉對話框

### 除錯技巧

```typescript
// 啟用除錯模式
console.log('Modal service:', this.modalService);

// 檢查對話框狀態
const modalRef = this.modalService.openCustom({...});
console.log('Modal ref:', modalRef);
```