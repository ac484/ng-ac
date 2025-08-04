/**
 * 基礎 DTO 介面
 * 提供標準化的 DTO 模式，確保所有應用層 DTO 的一致性
 */

/**
 * 基礎創建 DTO 介面
 * 創建時不需要 id, createdAt, updatedAt 等系統生成的欄位
 */
export interface BaseCreateDto {
    // 創建時不需要 id, createdAt, updatedAt
    // 子介面應該定義具體的業務欄位
}

/**
 * 基礎更新 DTO 介面
 * 更新時所有欄位都是可選的，允許部分更新
 */
export interface BaseUpdateDto {
    // 更新時所有欄位都是可選的
    // 子介面應該將所有業務欄位定義為可選
}

/**
 * 基礎回應 DTO 介面
 * 包含所有實體的基本系統欄位
 */
export interface BaseResponseDto {
    id: string;
    createdAt: string; // ISO 字串格式，便於前端處理
    updatedAt: string; // ISO 字串格式，便於前端處理
}

/**
 * 列表回應 DTO 介面
 * 標準化的分頁列表回應格式
 */
export interface ListResponseDto<T> {
    items: T[];           // 當前頁面的項目列表
    total: number;        // 總項目數量
    page: number;         // 當前頁碼（從 1 開始）
    pageSize: number;     // 每頁項目數量
    hasNext: boolean;     // 是否有下一頁
    hasPrevious: boolean; // 是否有上一頁
}

/**
 * 搜尋條件 DTO 介面
 * 標準化的搜尋和過濾條件格式
 */
export interface SearchCriteriaDto {
    keyword?: string;           // 關鍵字搜尋
    status?: string;            // 狀態過濾
    startDate?: string;         // 開始日期（ISO 字串格式）
    endDate?: string;           // 結束日期（ISO 字串格式）
    page?: number;              // 頁碼（從 1 開始）
    pageSize?: number;          // 每頁項目數量
    sortBy?: string;            // 排序欄位
    sortOrder?: 'asc' | 'desc'; // 排序方向
}

/**
 * 統計資料 DTO 基礎介面
 * 提供基本的統計資料結構
 */
export interface BaseStatsDto {
    total: number;              // 總數量
    // 移除索引簽名以避免與具體屬性衝突
    // 子介面可以定義具體的統計欄位
}

/**
 * 操作結果 DTO 介面
 * 標準化的操作結果回應格式
 */
export interface OperationResultDto {
    success: boolean;           // 操作是否成功
    message?: string;           // 操作結果訊息
    data?: any;                 // 操作結果資料
    errors?: string[];          // 錯誤訊息列表
}

/**
 * 批次操作 DTO 介面
 * 用於批次處理多個項目的操作
 */
export interface BatchOperationDto<T> {
    items: T[];                 // 要處理的項目列表
    operation: string;          // 操作類型
    options?: any;              // 操作選項
}

/**
 * 批次操作結果 DTO 介面
 * 批次操作的結果回應格式
 */
export interface BatchOperationResultDto<T> {
    totalCount: number;         // 總處理數量
    successCount: number;       // 成功處理數量
    failureCount: number;       // 失敗處理數量
    results: T[];               // 處理結果列表
    errors: string[];           // 錯誤訊息列表
}

/**
 * 匯出資料 DTO 介面
 * 標準化的資料匯出格式
 */
export interface ExportDataDto<T> {
    data: T[];                  // 匯出的資料
    exportDate: string;         // 匯出日期（ISO 字串格式）
    format: 'csv' | 'excel' | 'json' | 'pdf'; // 匯出格式
    filters?: SearchCriteriaDto; // 匯出時使用的過濾條件
    metadata?: any;             // 額外的元資料
}

/**
 * 驗證結果 DTO 介面
 * 標準化的驗證結果格式
 */
export interface ValidationResultDto {
    isValid: boolean;           // 驗證是否通過
    errors: string[];           // 錯誤訊息列表
    warnings: string[];         // 警告訊息列表
    fieldErrors?: {             // 欄位級別的錯誤
        [fieldName: string]: string[];
    };
}

/**
 * 檔案上傳 DTO 介面
 * 標準化的檔案上傳格式
 */
export interface FileUploadDto {
    fileName: string;           // 檔案名稱
    fileSize: number;           // 檔案大小（位元組）
    mimeType: string;           // MIME 類型
    content: string;            // Base64 編碼的檔案內容
    metadata?: any;             // 額外的檔案元資料
}

/**
 * 檔案上傳結果 DTO 介面
 * 檔案上傳的結果回應格式
 */
export interface FileUploadResultDto {
    fileId: string;             // 檔案 ID
    fileName: string;           // 檔案名稱
    fileUrl: string;            // 檔案存取 URL
    uploadDate: string;         // 上傳日期（ISO 字串格式）
    fileSize: number;           // 檔案大小（位元組）
}

/**
 * 審計日誌 DTO 介面
 * 標準化的審計日誌格式
 */
export interface AuditLogDto {
    id: string;                 // 日誌 ID
    entityType: string;         // 實體類型
    entityId: string;           // 實體 ID
    action: string;             // 操作類型
    userId: string;             // 操作用戶 ID
    userName: string;           // 操作用戶名稱
    timestamp: string;          // 操作時間（ISO 字串格式）
    oldValues?: any;            // 變更前的值
    newValues?: any;            // 變更後的值
    metadata?: any;             // 額外的元資料
}

/**
 * 通知 DTO 介面
 * 標準化的通知格式
 */
export interface NotificationDto {
    id: string;                 // 通知 ID
    type: 'info' | 'success' | 'warning' | 'error'; // 通知類型
    title: string;              // 通知標題
    message: string;            // 通知內容
    userId: string;             // 接收用戶 ID
    isRead: boolean;            // 是否已讀
    createdAt: string;          // 創建時間（ISO 字串格式）
    expiresAt?: string;         // 過期時間（ISO 字串格式）
    metadata?: any;             // 額外的元資料
}

/**
 * 系統設定 DTO 介面
 * 標準化的系統設定格式
 */
export interface SystemConfigDto {
    key: string;                // 設定鍵
    value: any;                 // 設定值
    type: 'string' | 'number' | 'boolean' | 'object'; // 值類型
    description?: string;       // 設定描述
    category?: string;          // 設定分類
    isReadOnly?: boolean;       // 是否唯讀
    updatedAt: string;          // 最後更新時間（ISO 字串格式）
    updatedBy: string;          // 最後更新用戶
}