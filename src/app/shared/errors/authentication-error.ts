/**
 * 認證錯誤類別
 * 用於處理用戶認證相關的錯誤
 */

import { BaseError } from './base-error';

export class AuthenticationError extends BaseError {
    readonly code = 'AUTHENTICATION_ERROR';
    readonly statusCode = 401;

    constructor(
        message: string,
        public readonly authType?: string,
        cause?: Error,
        context?: Record<string, any>
    ) {
        super(message, cause, context);
    }

    /**
     * 取得用戶友好的錯誤訊息
     */
    override getUserMessage(): string {
        if (this.authType) {
            return `${this.getAuthTypeDisplayName(this.authType)}失敗：${this.message}`;
        }
        return this.message;
    }

    /**
     * 取得認證類型的顯示名稱
     */
    private getAuthTypeDisplayName(authType: string): string {
        const authTypeNames: Record<string, string> = {
            login: '登入',
            logout: '登出',
            register: '註冊',
            resetPassword: '重設密碼',
            changePassword: '變更密碼',
            verifyEmail: '電子郵件驗證',
            verifyPhone: '手機驗證',
            twoFactor: '雙因素認證',
            oauth: '第三方登入',
            google: 'Google 登入',
            facebook: 'Facebook 登入',
            apple: 'Apple 登入',
            token: 'Token 驗證',
            session: 'Session 驗證'
        };

        return authTypeNames[authType] || authType;
    }

    /**
     * 建立登入失敗錯誤
     */
    static loginFailed(
        reason?: string,
        cause?: Error,
        context?: Record<string, any>
    ): AuthenticationError {
        const message = reason || '登入失敗，請檢查您的帳號和密碼';
        return new AuthenticationError(message, 'login', cause, context);
    }

    /**
     * 建立帳號不存在錯誤
     */
    static accountNotExists(
        email?: string,
        context?: Record<string, any>
    ): AuthenticationError {
        const message = email
            ? `帳號 ${email} 不存在，請先註冊`
            : '帳號不存在，請先註冊';

        return new AuthenticationError(message, 'login', undefined, context);
    }

    /**
     * 建立密碼錯誤
     */
    static invalidPassword(
        context?: Record<string, any>
    ): AuthenticationError {
        const message = '密碼錯誤，請重新輸入';
        return new AuthenticationError(message, 'login', undefined, context);
    }

    /**
     * 建立帳號被鎖定錯誤
     */
    static accountLocked(
        reason?: string,
        context?: Record<string, any>
    ): AuthenticationError {
        const message = reason || '帳號已被鎖定，請聯繫管理員';
        return new AuthenticationError(message, 'login', undefined, context);
    }

    /**
     * 建立帳號未驗證錯誤
     */
    static accountNotVerified(
        verificationType: 'email' | 'phone' = 'email',
        context?: Record<string, any>
    ): AuthenticationError {
        const typeText = verificationType === 'email' ? '電子郵件' : '手機號碼';
        const message = `請先驗證您的${typeText}`;

        return new AuthenticationError(message, 'login', undefined, context);
    }

    /**
     * 建立 Token 無效錯誤
     */
    static invalidToken(
        tokenType: 'access' | 'refresh' | 'reset' = 'access',
        context?: Record<string, any>
    ): AuthenticationError {
        const typeText = {
            access: '存取權杖',
            refresh: '刷新權杖',
            reset: '重設權杖'
        }[tokenType];

        const message = `${typeText}無效或已過期，請重新登入`;
        return new AuthenticationError(message, 'token', undefined, context);
    }

    /**
     * 建立 Token 過期錯誤
     */
    static tokenExpired(
        tokenType: 'access' | 'refresh' | 'reset' = 'access',
        context?: Record<string, any>
    ): AuthenticationError {
        const typeText = {
            access: '存取權杖',
            refresh: '刷新權杖',
            reset: '重設權杖'
        }[tokenType];

        const message = `${typeText}已過期，請重新登入`;
        return new AuthenticationError(message, 'token', undefined, context);
    }

    /**
     * 建立註冊失敗錯誤
     */
    static registrationFailed(
        reason?: string,
        cause?: Error,
        context?: Record<string, any>
    ): AuthenticationError {
        const message = reason || '註冊失敗，請稍後再試';
        return new AuthenticationError(message, 'register', cause, context);
    }

    /**
     * 建立帳號已存在錯誤
     */
    static accountExists(
        email: string,
        context?: Record<string, any>
    ): AuthenticationError {
        const message = `帳號 ${email} 已存在，請直接登入或使用其他電子郵件`;
        return new AuthenticationError(message, 'register', undefined, context);
    }

    /**
     * 建立密碼重設失敗錯誤
     */
    static passwordResetFailed(
        reason?: string,
        cause?: Error,
        context?: Record<string, any>
    ): AuthenticationError {
        const message = reason || '密碼重設失敗，請稍後再試';
        return new AuthenticationError(message, 'resetPassword', cause, context);
    }

    /**
     * 建立密碼變更失敗錯誤
     */
    static passwordChangeFailed(
        reason?: string,
        cause?: Error,
        context?: Record<string, any>
    ): AuthenticationError {
        const message = reason || '密碼變更失敗，請檢查舊密碼是否正確';
        return new AuthenticationError(message, 'changePassword', cause, context);
    }

    /**
     * 建立第三方登入失敗錯誤
     */
    static oauthFailed(
        provider: string,
        reason?: string,
        cause?: Error,
        context?: Record<string, any>
    ): AuthenticationError {
        const message = reason || `${provider} 登入失敗，請稍後再試`;
        return new AuthenticationError(message, 'oauth', cause, { ...context, provider });
    }

    /**
     * 建立雙因素認證失敗錯誤
     */
    static twoFactorFailed(
        reason?: string,
        cause?: Error,
        context?: Record<string, any>
    ): AuthenticationError {
        const message = reason || '雙因素認證失敗，請檢查驗證碼';
        return new AuthenticationError(message, 'twoFactor', cause, context);
    }

    /**
     * 建立 Session 過期錯誤
     */
    static sessionExpired(
        context?: Record<string, any>
    ): AuthenticationError {
        const message = '登入狀態已過期，請重新登入';
        return new AuthenticationError(message, 'session', undefined, context);
    }

    /**
     * 建立權限不足錯誤
     */
    static insufficientPrivileges(
        requiredRole?: string,
        context?: Record<string, any>
    ): AuthenticationError {
        const message = requiredRole
            ? `需要 ${requiredRole} 權限才能執行此操作`
            : '權限不足，無法執行此操作';

        return new AuthenticationError(message, 'authorization', undefined, context);
    }
}