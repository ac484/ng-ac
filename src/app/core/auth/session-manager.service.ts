import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';
import { FirebaseErrorHandlerService } from './firebase-error-handler.service';

/**
 * 會話資料介面
 */
export interface SessionData {
    uid: string;
    email?: string;
    displayName?: string;
    photoURL?: string;
    lastActivity: number;
    sessionId: string;
    version: string;
    createdAt: number;
    deviceInfo?: string;
}

/**
 * 會話管理服務
 * 
 * 負責會話的持久化、恢復和驗證
 * 遵循精簡主義原則，僅包含必要功能
 */
@Injectable({
    providedIn: 'root'
})
export class SessionManagerService {
    private readonly firebaseAuth = inject(FirebaseAuthAdapterService);
    private readonly errorHandler = inject(FirebaseErrorHandlerService);

    private readonly SESSION_KEY = 'firebase_auth_session';
    private readonly SESSION_VERSION = '1.0.0';
    private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 小時

    /**
     * 在應用程式啟動時恢復會話
     * @returns Observable<boolean> 是否成功恢復會話
     */
    restoreSession(): Observable<boolean> {
        try {
            const sessionData = this.getStoredSession();

            if (!sessionData) {
                return of(false);
            }

            if (!this.isSessionValid(sessionData)) {
                this.clearStoredSession();
                return of(false);
            }

            // 檢查 Firebase Auth 狀態
            return this.firebaseAuth.getCurrentUser().pipe(
                switchMap(user => {
                    if (user && user.uid === sessionData.uid) {
                        // Firebase 使用者存在且匹配，更新會話活動時間
                        this.updateSessionActivity(sessionData);
                        return of(true);
                    } else {
                        // Firebase 使用者不存在或不匹配，清除會話
                        this.clearStoredSession();
                        return of(false);
                    }
                }),
                catchError(error => {
                    this.errorHandler.handleSessionRestoreError(error);
                    this.clearStoredSession();
                    return of(false);
                })
            );
        } catch (error) {
            this.errorHandler.handleSessionRestoreError(error);
            this.clearStoredSession();
            return of(false);
        }
    }

    /**
     * 保存會話資料
     * @param user Firebase 使用者物件
     */
    saveSession(user: any): Observable<void> {
        try {
            const now = Date.now();
            const sessionData: SessionData = {
                uid: user.uid,
                email: user.email || undefined,
                displayName: user.displayName || undefined,
                photoURL: user.photoURL || undefined,
                lastActivity: now,
                sessionId: this.generateSessionId(),
                version: this.SESSION_VERSION,
                createdAt: now,
                deviceInfo: this.getDeviceInfo()
            };

            localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
            return of(void 0);
        } catch (error) {
            this.errorHandler.handleSilentError(error);
            return of(void 0);
        }
    }

    /**
     * 清除會話資料
     */
    clearSession(): Observable<void> {
        try {
            this.clearStoredSession();
            return of(void 0);
        } catch (error) {
            this.errorHandler.handleSilentError(error);
            return of(void 0);
        }
    }

    /**
     * 驗證會話完整性
     * @returns Observable<boolean> 會話是否有效
     */
    validateSession(): Observable<boolean> {
        try {
            const sessionData = this.getStoredSession();

            if (!sessionData) {
                return of(false);
            }

            if (!this.isSessionValid(sessionData)) {
                this.clearStoredSession();
                return of(false);
            }

            // 檢查 Firebase Auth 狀態是否與會話匹配
            return this.firebaseAuth.getCurrentUser().pipe(
                map(user => {
                    if (user && user.uid === sessionData.uid) {
                        this.updateSessionActivity(sessionData);
                        return true;
                    } else {
                        this.clearStoredSession();
                        return false;
                    }
                }),
                catchError(() => {
                    this.clearStoredSession();
                    return of(false);
                })
            );
        } catch (error) {
            this.errorHandler.handleSilentError(error);
            this.clearStoredSession();
            return of(false);
        }
    }

    /**
     * 更新會話活動時間
     */
    updateActivity(): Observable<void> {
        try {
            const sessionData = this.getStoredSession();

            if (sessionData && this.isSessionValid(sessionData)) {
                this.updateSessionActivity(sessionData);
            }

            return of(void 0);
        } catch (error) {
            this.errorHandler.handleSilentError(error);
            return of(void 0);
        }
    }

    /**
     * 取得儲存的會話資料
     * @returns SessionData | null
     */
    private getStoredSession(): SessionData | null {
        try {
            const stored = localStorage.getItem(this.SESSION_KEY);
            if (!stored) {
                return null;
            }

            const sessionData = JSON.parse(stored) as SessionData;

            // 檢查基本結構
            if (!sessionData.uid || !sessionData.sessionId || !sessionData.version) {
                return null;
            }

            return sessionData;
        } catch (error) {
            // JSON 解析錯誤或其他錯誤
            return null;
        }
    }

    /**
     * 檢查會話是否有效
     * @param sessionData 會話資料
     * @returns boolean
     */
    private isSessionValid(sessionData: SessionData): boolean {
        // 檢查版本相容性
        if (sessionData.version !== this.SESSION_VERSION) {
            return false;
        }

        // 檢查會話是否過期
        const now = Date.now();
        const timeSinceLastActivity = now - sessionData.lastActivity;

        if (timeSinceLastActivity > this.SESSION_TIMEOUT) {
            return false;
        }

        // 檢查必要欄位
        if (!sessionData.uid || !sessionData.sessionId) {
            return false;
        }

        // 檢查設備一致性（可選的安全檢查）
        if (!this.isFromSameDevice(sessionData)) {
            return false;
        }

        // 檢查會話創建時間是否合理（防止時間戳篡改）
        if (sessionData.createdAt && sessionData.createdAt > now) {
            return false;
        }

        // 檢查最後活動時間是否合理
        if (sessionData.lastActivity > now) {
            return false;
        }

        return true;
    }

    /**
     * 更新會話活動時間
     * @param sessionData 會話資料
     */
    private updateSessionActivity(sessionData: SessionData): void {
        try {
            sessionData.lastActivity = Date.now();
            localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
        } catch (error) {
            // 靜默處理儲存錯誤
            this.errorHandler.handleSilentError(error);
        }
    }

    /**
     * 清除儲存的會話資料
     */
    private clearStoredSession(): void {
        try {
            localStorage.removeItem(this.SESSION_KEY);
        } catch (error) {
            // 靜默處理清除錯誤
            this.errorHandler.handleSilentError(error);
        }
    }

    /**
     * 生成會話 ID
     * @returns string
     */
    private generateSessionId(): string {
        return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    }

    /**
     * 取得當前會話資訊（用於調試）
     * @returns SessionData | null
     */
    getCurrentSessionInfo(): SessionData | null {
        return this.getStoredSession();
    }

    /**
     * 取得設備資訊
     * @returns string
     */
    private getDeviceInfo(): string {
        try {
            const userAgent = navigator.userAgent;
            const platform = navigator.platform;
            const language = navigator.language;

            // 簡化的設備指紋，僅用於會話驗證
            return `${platform}_${language}_${userAgent.length}`;
        } catch (error) {
            return 'unknown_device';
        }
    }

    /**
     * 檢查會話是否來自相同設備
     * @param sessionData 會話資料
     * @returns boolean
     */
    private isFromSameDevice(sessionData: SessionData): boolean {
        if (!sessionData.deviceInfo) {
            // 舊版本會話資料，允許通過
            return true;
        }

        const currentDeviceInfo = this.getDeviceInfo();
        return sessionData.deviceInfo === currentDeviceInfo;
    }

    /**
     * 處理會話過期清理
     * 清理過期的會話資料
     */
    cleanupExpiredSessions(): Observable<void> {
        try {
            const sessionData = this.getStoredSession();

            if (sessionData && !this.isSessionValid(sessionData)) {
                this.clearStoredSession();
            }

            return of(void 0);
        } catch (error) {
            this.errorHandler.handleSilentError(error);
            return of(void 0);
        }
    }
}