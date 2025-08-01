import { Injectable, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, of } from 'rxjs';

/**
 * Firebase 錯誤代碼映射
 */
export interface FirebaseErrorMapping {
    code: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
}

/**
 * Firebase 錯誤處理服務
 * 
 * 提供統一的 Firebase 錯誤處理和用戶友好的錯誤訊息顯示
 * 整合 ng-alain 的通知系統
 */
@Injectable({
    providedIn: 'root'
})
export class FirebaseErrorHandlerService {
    private readonly messageService = inject(NzMessageService);

    /**
     * Firebase 錯誤代碼到用戶友好訊息的映射
     */
    private readonly errorMappings: FirebaseErrorMapping[] = [
        // 認證錯誤
        { code: 'auth/user-not-found', message: '找不到此用戶，請檢查 Email 是否正確', severity: 'error' },
        { code: 'auth/wrong-password', message: '密碼錯誤，請重新輸入', severity: 'error' },
        { code: 'auth/invalid-email', message: 'Email 格式不正確', severity: 'error' },
        { code: 'auth/user-disabled', message: '此帳戶已被停用，請聯繫管理員', severity: 'error' },
        { code: 'auth/too-many-requests', message: '登入嘗試次數過多，請稍後再試', severity: 'warning' },
        { code: 'auth/network-request-failed', message: '網路連線失敗，請檢查網路狀態', severity: 'error' },
        { code: 'auth/invalid-credential', message: 'Email 或密碼錯誤', severity: 'error' },
        { code: 'auth/email-already-in-use', message: '此 Email 已被使用', severity: 'error' },
        { code: 'auth/weak-password', message: '密碼強度不足，請使用至少 6 個字元', severity: 'warning' },
        { code: 'auth/operation-not-allowed', message: '此操作未被允許', severity: 'error' },
        { code: 'auth/invalid-verification-code', message: '驗證碼無效', severity: 'error' },
        { code: 'auth/invalid-verification-id', message: '驗證 ID 無效', severity: 'error' },

        // Token 相關錯誤
        { code: 'auth/id-token-expired', message: '登入已過期，請重新登入', severity: 'warning' },
        { code: 'auth/id-token-revoked', message: '登入憑證已被撤銷，請重新登入', severity: 'error' },
        { code: 'auth/invalid-id-token', message: '登入憑證無效，請重新登入', severity: 'error' },

        // 網路和服務錯誤
        { code: 'auth/timeout', message: '請求超時，請稍後再試', severity: 'warning' },
        { code: 'auth/internal-error', message: '內部錯誤，請稍後再試', severity: 'error' },
        { code: 'auth/service-unavailable', message: '服務暫時不可用，請稍後再試', severity: 'error' },

        // 自定義錯誤
        { code: 'token-sync-failed', message: 'Token 同步失敗，請重新登入', severity: 'error' },
        { code: 'session-restore-failed', message: '會話恢復失敗，請重新登入', severity: 'warning' },
        { code: 'token-refresh-failed', message: 'Token 刷新失敗，請重新登入', severity: 'error' },
        { code: 'auth-state-error', message: '認證狀態錯誤，請重新登入', severity: 'error' }
    ];

    /**
     * 處理 Firebase 錯誤並顯示用戶友好的訊息
     * @param error Firebase 錯誤物件或錯誤代碼
     * @param showNotification 是否顯示通知訊息
     * @returns 處理後的錯誤訊息
     */
    handleError(error: any, showNotification: boolean = true): string {
        const errorCode = this.extractErrorCode(error);
        const errorMapping = this.findErrorMapping(errorCode);

        const userMessage = errorMapping?.message || this.getDefaultErrorMessage(error);

        // 記錄詳細錯誤信息用於調試
        this.logError(error, errorCode, userMessage);

        // 顯示用戶通知
        if (showNotification) {
            this.showNotification(userMessage, errorMapping?.severity || 'error');
        }

        return userMessage;
    }

    /**
     * 處理 Token 刷新失敗錯誤
     * @param error 錯誤物件
     */
    handleTokenRefreshError(error: any): void {
        const userMessage = '登入已過期，請重新登入';
        this.logError(error, 'token-refresh-failed', userMessage);
        this.showNotification(userMessage, 'warning');
    }

    /**
     * 處理會話恢復錯誤
     * @param error 錯誤物件
     */
    handleSessionRestoreError(error: any): void {
        const userMessage = '會話恢復失敗，將重新導向到登入頁面';
        this.logError(error, 'session-restore-failed', userMessage);
        this.showNotification(userMessage, 'info');
    }

    /**
     * 處理認證狀態錯誤
     * @param error 錯誤物件
     */
    handleAuthStateError(error: any): void {
        const userMessage = '認證狀態異常，請重新登入';
        this.logError(error, 'auth-state-error', userMessage);
        this.showNotification(userMessage, 'error');
    }

    /**
     * 靜默處理錯誤（不顯示通知）
     * @param error 錯誤物件
     * @returns 錯誤訊息
     */
    handleSilentError(error: any): string {
        return this.handleError(error, false);
    }

    /**
     * 提取錯誤代碼
     * @param error 錯誤物件
     * @returns 錯誤代碼
     */
    private extractErrorCode(error: any): string {
        if (typeof error === 'string') {
            return error;
        }

        return error?.code || error?.message || 'unknown-error';
    }

    /**
     * 查找錯誤映射
     * @param errorCode 錯誤代碼
     * @returns 錯誤映射物件
     */
    private findErrorMapping(errorCode: string): FirebaseErrorMapping | undefined {
        return this.errorMappings.find(mapping => mapping.code === errorCode);
    }

    /**
     * 取得預設錯誤訊息
     * @param error 錯誤物件
     * @returns 預設錯誤訊息
     */
    private getDefaultErrorMessage(error: any): string {
        if (typeof error === 'string') {
            return error;
        }

        return error?.message || '發生未知錯誤，請稍後再試';
    }

    /**
     * 記錄錯誤信息
     * @param originalError 原始錯誤
     * @param errorCode 錯誤代碼
     * @param userMessage 用戶訊息
     */
    private logError(originalError: any, errorCode: string, userMessage: string): void {
        const logData = {
            timestamp: new Date().toISOString(),
            errorCode,
            userMessage,
            originalError: originalError,
            stack: originalError?.stack
        };

        console.error('[Firebase Auth Error]', logData);

        // 在生產環境中，這裡可以發送錯誤到監控服務
        // 例如：Sentry, LogRocket, 或自定義錯誤追蹤服務
    }

    /**
     * 顯示通知訊息
     * @param message 訊息內容
     * @param severity 嚴重程度
     */
    private showNotification(message: string, severity: 'error' | 'warning' | 'info'): void {
        switch (severity) {
            case 'error':
                this.messageService.error(message, { nzDuration: 5000 });
                break;
            case 'warning':
                this.messageService.warning(message, { nzDuration: 4000 });
                break;
            case 'info':
                this.messageService.info(message, { nzDuration: 3000 });
                break;
        }
    }

    /**
     * 取得所有錯誤映射（用於測試和調試）
     * @returns 錯誤映射陣列
     */
    getErrorMappings(): FirebaseErrorMapping[] {
        return [...this.errorMappings];
    }
}