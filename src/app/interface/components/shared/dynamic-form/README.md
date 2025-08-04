# Dynamic Form Component

動態表單組件，支援多種輸入類型，整合 ng-zorro-antd 的表單驗證和錯誤顯示功能。

## 功能特色

- 支援多種輸入類型：文字、數字、選擇器、日期、複選框、單選按鈕等
- 整合 nz-form 的驗證和錯誤顯示
- 支援自定義驗證規則
- 響應式佈局支援
- 自動聚焦和錯誤提示
- 完整的表單生命週期管理

## 使用方式

### 基本用法

```typescript
import { DynamicFormComponent } from './dynamic-form.component';

@Component({
  template: `
    <app-dynamic-form 
      [config]="formConfig"
      [initialValue]="initialData"
      [loading]="isLoading"
      (formSubmit)="onSubmit($event)"
      (formChange)="onFormChange($event)">
    </app-dynamic-form>
  `
})
export class MyComponent {
  formConfig: FormConfig = {
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
        validators: [
          { type: 'email', message: '請輸入有效的電子郵件地址' }
        ]
      },
      {
        key: 'age',
        label: '年齡',
        type: 'number',
        attributes: { min: 0, max: 120 }
      }
    ],
    layout: 'vertical'
  };

  initialData = {
    name: 'John Doe',
    email: 'john@example.com'
  };

  onSubmit(formValue: any) {
    console.log('Form submitted:', formValue);
  }

  onFormChange(formValue: any) {
    console.log('Form changed:', formValue);
  }
}
```

### 進階配置

```typescript
const advancedConfig: FormConfig = {
  fields: [
    {
      key: 'username',
      label: '用戶名',
      type: 'text',
      required: true,
      validators: [
        { type: 'minLength', value: 3, message: '用戶名至少需要3個字符' },
        { type: 'pattern', value: '^[a-zA-Z0-9_]+$', message: '只能包含字母、數字和下劃線' }
      ],
      span: 12
    },
    {
      key: 'password',
      label: '密碼',
      type: 'password',
      required: true,
      validators: [
        { type: 'minLength', value: 8, message: '密碼至少需要8個字符' }
      ],
      span: 12
    },
    {
      key: 'role',
      label: '角色',
      type: 'select',
      required: true,
      options: [
        { label: '管理員', value: 'admin' },
        { label: '用戶', value: 'user' },
        { label: '訪客', value: 'guest', disabled: true }
      ],
      span: 24
    },
    {
      key: 'birthDate',
      label: '出生日期',
      type: 'date',
      span: 12
    },
    {
      key: 'description',
      label: '描述',
      type: 'textarea',
      placeholder: '請輸入描述...',
      attributes: { rows: 4 },
      span: 24
    },
    {
      key: 'agreeTerms',
      label: '同意條款',
      type: 'checkbox',
      required: true,
      description: '我同意服務條款和隱私政策'
    }
  ],
  layout: 'horizontal',
  labelSpan: 6,
  controlSpan: 18,
  autoFocus: true
};
```

## API 參考

### 輸入屬性 (Input Properties)

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `config` | `FormConfig` | `{ fields: [] }` | 表單配置 |
| `initialValue` | `any` | `{}` | 表單初始值 |
| `loading` | `boolean` | `false` | 載入狀態 |
| `showButtons` | `boolean` | `true` | 是否顯示按鈕 |
| `showResetButton` | `boolean` | `true` | 是否顯示重置按鈕 |
| `showCancelButton` | `boolean` | `false` | 是否顯示取消按鈕 |
| `submitText` | `string` | `'提交'` | 提交按鈕文字 |
| `resetText` | `string` | `'重置'` | 重置按鈕文字 |
| `cancelText` | `string` | `'取消'` | 取消按鈕文字 |

### 輸出事件 (Output Events)

| 事件 | 類型 | 說明 |
|------|------|------|
| `formSubmit` | `EventEmitter<any>` | 表單提交事件 |
| `formReset` | `EventEmitter<void>` | 表單重置事件 |
| `formCancel` | `EventEmitter<void>` | 表單取消事件 |
| `formChange` | `EventEmitter<any>` | 表單值變更事件 |
| `formStatusChange` | `EventEmitter<string>` | 表單狀態變更事件 |

### 公開方法 (Public Methods)

| 方法 | 參數 | 返回值 | 說明 |
|------|------|--------|------|
| `getFormValue()` | - | `any` | 取得表單值 |
| `setFormValue(value)` | `any` | `void` | 設定表單值 |
| `resetField(fieldKey)` | `string` | `void` | 重置特定欄位 |
| `setFieldDisabled(fieldKey, disabled)` | `string, boolean` | `void` | 設定欄位禁用狀態 |
| `validateForm()` | - | `boolean` | 驗證表單 |

## 欄位類型

### 支援的欄位類型

- `text` - 文字輸入
- `number` - 數字輸入
- `email` - 電子郵件輸入
- `password` - 密碼輸入
- `textarea` - 多行文字輸入
- `select` - 下拉選擇器
- `date` - 日期選擇器
- `checkbox` - 複選框
- `radio` - 單選按鈕組

### 驗證器類型

- `required` - 必填驗證
- `email` - 電子郵件格式驗證
- `minLength` - 最小長度驗證
- `maxLength` - 最大長度驗證
- `min` - 最小值驗證
- `max` - 最大值驗證
- `pattern` - 正則表達式驗證
- `custom` - 自定義驗證

## 佈局選項

- `vertical` - 垂直佈局（預設）
- `horizontal` - 水平佈局
- `inline` - 行內佈局

## 最佳實踐

1. **欄位配置**：合理設定欄位的 `span` 屬性來控制佈局
2. **驗證規則**：提供清晰的錯誤訊息
3. **初始值**：設定合適的預設值提升用戶體驗
4. **響應式設計**：在不同螢幕尺寸下測試表單佈局
5. **無障礙支援**：確保表單標籤和錯誤訊息的可讀性

## 範例

查看 `dynamic-form-example.component.ts` 了解更多使用範例。