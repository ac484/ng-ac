import { Injectable, inject } from '@angular/core';
import { AppCheck, getToken, AppCheckTokenResult } from '@angular/fire/app-check';

@Injectable({
    providedIn: 'root'
})
export class FirebaseInitService {
    private appCheck = inject(AppCheck);

    /**
     * 確保 App Check 在應用啟動時正確初始化
     * 這個方法會等待 App Check 獲取第一個令牌後才完成
     */
    async initializeAppCheck(): Promise<void> {
        try {
            console.log('🔥 開始初始化 Firebase App Check...');

            // 等待 App Check 獲取第一個令牌
            const token = await getToken(this.appCheck);

            if (token) {
                console.log('🔥 App Check 初始化成功，令牌已獲取');
            } else {
                console.warn('🔥 App Check 初始化完成，但未獲取到令牌');
            }
        } catch (error) {
            console.error('🔥 App Check 初始化失敗:', error);

            // 根據錯誤類型提供更詳細的信息
            if (error instanceof Error) {
                if (error.message.includes('recaptcha-error')) {
                    console.error('🔥 ReCAPTCHA 配置錯誤，請檢查 Firebase Console 中的 App Check 設定');
                } else if (error.message.includes('network-request-failed')) {
                    console.error('🔥 網路請求失敗，請檢查網路連接');
                }
            }

            // 在開發環境中，App Check 錯誤不應該阻止應用啟動
            // 在生產環境中，你可能想要更嚴格的處理
            throw error;
        }
    }

    /**
     * 檢查 App Check 是否已經初始化並可用
     */
    async isAppCheckReady(): Promise<boolean> {
        try {
            const token = await getToken(this.appCheck);
            return !!token;
        } catch (error) {
            console.error('🔥 檢查 App Check 狀態失敗:', error);
            return false;
        }
    }

    /**
     * 手動刷新 App Check 令牌
     */
    async refreshAppCheckToken(): Promise<string | null> {
        try {
            const tokenResult = await getToken(this.appCheck, true); // 強制刷新
            console.log('🔥 App Check 令牌已刷新');
            return tokenResult.token;
        } catch (error) {
            console.error('🔥 刷新 App Check 令牌失敗:', error);
            return null;
        }
    }
}