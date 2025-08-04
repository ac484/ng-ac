/**
 * 模態框範本組件統一導出
 */

// 服務
export * from '../../../services/modal.service';

// 組件
export * from './confirmation-modal.component';
export * from './form-modal.component';
export * from './loading-modal.component';
export * from './modal-examples.component';

// 類型定義
export interface ModalTemplateConfig {
  confirmation: {
    component: typeof import('./confirmation-modal.component').ConfirmationModalComponent;
    data: import('./confirmation-modal.component').ConfirmationData;
  };
  form: {
    component: typeof import('./form-modal.component').FormModalComponent;
    data: import('./form-modal.component').FormModalData;
  };
  loading: {
    component: typeof import('./loading-modal.component').LoadingModalComponent;
    data: import('./loading-modal.component').LoadingModalData;
  };
}

// 常用的表單欄位配置
export const CommonFormFields = {
  // 用戶相關欄位
  user: {
    name: {
      key: 'name',
      label: '姓名',
      type: 'text' as const,
      required: true,
      placeholder: '請輸入姓名'
    },
    email: {
      key: 'email',
      label: '電子郵件',
      type: 'email' as const,
      required: true,
      placeholder: '請輸入電子郵件'
    },
    phone: {
      key: 'phone',
      label: '電話號碼',
      type: 'text' as const,
      placeholder: '請輸入電話號碼',
      pattern: '^[0-9-+()\\s]+$',
      errorMessage: '請輸入有效的電話號碼'
    },
    age: {
      key: 'age',
      label: '年齡',
      type: 'number' as const,
      min: 0,
      max: 150
    }
  },

  // 交易相關欄位
  transaction: {
    amount: {
      key: 'amount',
      label: '金額',
      type: 'number' as const,
      required: true,
      min: 0.01,
      step: 0.01,
      precision: 2,
      placeholder: '請輸入金額'
    },
    currency: {
      key: 'currency',
      label: '貨幣',
      type: 'select' as const,
      required: true,
      defaultValue: 'TWD',
      options: [
        { label: '新台幣 (TWD)', value: 'TWD' },
        { label: '美元 (USD)', value: 'USD' },
        { label: '歐元 (EUR)', value: 'EUR' },
        { label: '日圓 (JPY)', value: 'JPY' }
      ]
    },
    description: {
      key: 'description',
      label: '描述',
      type: 'textarea' as const,
      required: true,
      rows: 3,
      maxLength: 500,
      placeholder: '請輸入交易描述'
    },
    category: {
      key: 'category',
      label: '分類',
      type: 'select' as const,
      options: [
        { label: '收入', value: 'income' },
        { label: '支出', value: 'expense' },
        { label: '轉帳', value: 'transfer' },
        { label: '投資', value: 'investment' }
      ]
    }
  },

  // 帳戶相關欄位
  account: {
    name: {
      key: 'name',
      label: '帳戶名稱',
      type: 'text' as const,
      required: true,
      placeholder: '請輸入帳戶名稱'
    },
    type: {
      key: 'type',
      label: '帳戶類型',
      type: 'select' as const,
      required: true,
      options: [
        { label: '支票帳戶', value: 'checking' },
        { label: '儲蓄帳戶', value: 'savings' },
        { label: '信用帳戶', value: 'credit' },
        { label: '投資帳戶', value: 'investment' }
      ]
    },
    initialBalance: {
      key: 'initialBalance',
      label: '初始餘額',
      type: 'number' as const,
      min: 0,
      step: 0.01,
      precision: 2,
      defaultValue: 0,
      placeholder: '請輸入初始餘額'
    }
  },

  // 通用欄位
  common: {
    title: {
      key: 'title',
      label: '標題',
      type: 'text' as const,
      required: true,
      placeholder: '請輸入標題'
    },
    description: {
      key: 'description',
      label: '描述',
      type: 'textarea' as const,
      rows: 4,
      placeholder: '請輸入描述'
    },
    status: {
      key: 'status',
      label: '狀態',
      type: 'select' as const,
      options: [
        { label: '啟用', value: 'active' },
        { label: '停用', value: 'inactive' },
        { label: '暫停', value: 'suspended' }
      ]
    },
    priority: {
      key: 'priority',
      label: '優先級',
      type: 'radio' as const,
      options: [
        { label: '高', value: 'high' },
        { label: '中', value: 'medium' },
        { label: '低', value: 'low' }
      ]
    },
    tags: {
      key: 'tags',
      label: '標籤',
      type: 'text' as const,
      placeholder: '請輸入標籤，用逗號分隔',
      helpText: '多個標籤請用逗號分隔'
    },
    isActive: {
      key: 'isActive',
      label: '啟用',
      type: 'switch' as const,
      defaultValue: true
    },
    sendNotification: {
      key: 'sendNotification',
      label: '發送通知',
      type: 'checkbox' as const,
      defaultValue: false
    },
    date: {
      key: 'date',
      label: '日期',
      type: 'date' as const,
      placeholder: '請選擇日期'
    },
    datetime: {
      key: 'datetime',
      label: '日期時間',
      type: 'datetime' as const,
      placeholder: '請選擇日期時間'
    }
  }
};

// 常用的確認對話框配置
export const CommonConfirmations = {
  delete: (itemName: string) => ({
    title: '確認刪除',
    message: `確定要刪除 "${itemName}" 嗎？`,
    type: 'error' as const,
    confirmText: '確定刪除',
    cancelText: '取消',
    details: ['此操作無法復原，請謹慎操作。']
  }),

  save: (itemName: string) => ({
    title: '確認儲存',
    message: `確定要儲存 "${itemName}" 的變更嗎？`,
    type: 'info' as const,
    confirmText: '確定儲存',
    cancelText: '取消'
  }),

  discard: () => ({
    title: '放棄變更',
    message: '您有未儲存的變更，確定要放棄嗎？',
    type: 'warning' as const,
    confirmText: '放棄變更',
    cancelText: '繼續編輯'
  }),

  logout: () => ({
    title: '確認登出',
    message: '確定要登出系統嗎？',
    type: 'info' as const,
    confirmText: '確定登出',
    cancelText: '取消'
  }),

  reset: () => ({
    title: '重置設定',
    message: '確定要重置所有設定為預設值嗎？',
    type: 'warning' as const,
    confirmText: '確定重置',
    cancelText: '取消',
    details: ['此操作將清除所有自定義設定。']
  })
};

// 常用的載入配置
export const CommonLoadings = {
  saving: {
    title: '儲存中',
    message: '正在儲存資料，請稍候...',
    type: 'spin' as const
  },

  loading: {
    title: '載入中',
    message: '正在載入資料，請稍候...',
    type: 'spin' as const
  },

  uploading: {
    title: '上傳中',
    message: '正在上傳檔案...',
    type: 'progress' as const,
    showProgress: true
  },

  processing: {
    title: '處理中',
    message: '正在處理您的請求...',
    type: 'dots' as const
  },

  syncing: {
    title: '同步中',
    message: '正在同步資料到雲端...',
    type: 'progress' as const,
    showProgress: true,
    estimatedTime: 30
  }
};
