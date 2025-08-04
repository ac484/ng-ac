/**
 * 表格欄位配置介面
 * 定義表格欄位的顯示和行為配置
 */
export interface TableColumn {
    /** 欄位鍵值，對應資料物件的屬性名稱 */
    key: string;

    /** 欄位標題 */
    title: string;

    /** 欄位類型，決定顯示格式 */
    type: 'text' | 'status' | 'currency' | 'date' | 'number' | 'boolean';

    /** 欄位寬度 */
    width?: string;

    /** 是否可排序 */
    sortable?: boolean;

    /** 排序函數 */
    sortFn?: (a: any, b: any) => number;

    /** 是否可篩選 */
    filterable?: boolean;

    /** 篩選函數 */
    filterFn?: (value: any, item: any) => boolean;

    /** 篩選選項 */
    filters?: Array<{ text: string; value: any }>;

    /** 自定義格式化函數 */
    formatter?: (value: any, item: any) => string;

    /** 狀態類型的顏色映射 */
    statusColors?: { [key: string]: string };

    /** 狀態類型的文字映射 */
    statusTexts?: { [key: string]: string };

    /** 是否隱藏欄位 */
    hidden?: boolean;

    /** 欄位對齊方式 */
    align?: 'left' | 'center' | 'right';
}

/**
 * 表格操作按鈕配置介面
 */
export interface TableAction {
    /** 操作類型 */
    type: 'view' | 'edit' | 'delete' | 'custom';

    /** 操作標題 */
    title: string;

    /** 圖示類型 */
    icon: string;

    /** 自定義操作的鍵值（當 type 為 'custom' 時使用） */
    key?: string;

    /** 是否為危險操作 */
    danger?: boolean;

    /** 是否禁用 */
    disabled?: (item: any) => boolean;

    /** 是否顯示 */
    visible?: (item: any) => boolean;

    /** 自定義點擊處理 */
    handler?: (item: any) => void;
}

/**
 * 分頁配置介面
 */
export interface PaginationConfig {
    /** 當前頁碼 */
    pageIndex: number;

    /** 每頁顯示數量 */
    pageSize: number;

    /** 總數據量 */
    total: number;

    /** 是否顯示每頁數量選擇器 */
    showSizeChanger?: boolean;

    /** 是否顯示快速跳轉 */
    showQuickJumper?: boolean;

    /** 每頁數量選項 */
    pageSizeOptions?: number[];
}

/**
 * 表格滾動配置介面
 */
export interface ScrollConfig {
    /** 水平滾動 */
    x?: string | null;

    /** 垂直滾動 */
    y?: string | null;
}