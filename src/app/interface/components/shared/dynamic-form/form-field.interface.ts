/**
 * 動態表單欄位配置介面
 * 定義表單欄位的類型、驗證和行為配置
 */
export interface FormField {
    /** 欄位鍵值，對應表單控制項名稱 */
    key: string;

    /** 欄位標籤 */
    label: string;

    /** 欄位類型 */
    type: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'date' | 'checkbox' | 'radio';

    /** 是否必填 */
    required?: boolean;

    /** 預設值 */
    defaultValue?: any;

    /** 佔位符文字 */
    placeholder?: string;

    /** 欄位說明 */
    description?: string;

    /** 是否禁用 */
    disabled?: boolean;

    /** 是否隱藏 */
    hidden?: boolean;

    /** 選項列表（用於 select、radio、checkbox） */
    options?: Array<{ label: string; value: any; disabled?: boolean }>;

    /** 驗證規則 */
    validators?: FormFieldValidator[];

    /** 欄位寬度（Grid 系統） */
    span?: number;

    /** 自定義屬性 */
    attributes?: { [key: string]: any };
}

/**
 * 表單欄位驗證器介面
 */
export interface FormFieldValidator {
    /** 驗證器類型 */
    type: 'required' | 'email' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'custom';

    /** 驗證器參數 */
    value?: any;

    /** 錯誤訊息 */
    message: string;

    /** 自定義驗證函數 */
    validator?: (value: any) => boolean;
}

/**
 * 表單配置介面
 */
export interface FormConfig {
    /** 表單欄位列表 */
    fields: FormField[];

    /** 表單佈局 */
    layout?: 'horizontal' | 'vertical' | 'inline';

    /** 標籤寬度（水平佈局時使用） */
    labelSpan?: number;

    /** 控制項寬度（水平佈局時使用） */
    controlSpan?: number;

    /** 是否顯示必填標記 */
    showRequiredMark?: boolean;

    /** 是否自動聚焦第一個欄位 */
    autoFocus?: boolean;
}