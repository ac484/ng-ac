import { Injectable, inject } from '@angular/core';
import { Auth, User, authState, signInAnonymously, signInWithPopup, GoogleAuthProvider, signOut } from '@angular/fire/auth';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';
import { WindowService } from '@core/services/common/window.service';
import { TokenKey, TokenPre } from '@config/constant';

export interface FirebaseUserInfo {
    uid: string;
    email: string | null;
    displayName: string | null;
    isAnonymous: boolean;
    photoURL: string | null;
    emailVerified: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class FirebaseAuthService {
    private auth = inject(Auth);
    private windowService = inject(WindowService);
    private currentUserSubject = new BehaviorSubject<FirebaseUserInfo | null>(null);
    private tokenRefreshSubscription?: Subscription;

    // 當前用戶狀態
    public currentUser$ = this.currentUserSubject.asObservable();

    // Firebase Auth 狀態
    public authState$ = authState(this.auth);

    // 是否已登入
    public isLoggedIn$ = this.authState$.pipe(
        map(user => !!user)
    );

    // 是否為匿名用戶
    public isAnonymous$ = this.authState$.pipe(
        map(user => user?.isAnonymous || false)
    );

    constructor() {
        // 監聽 Firebase Auth 狀態變化
        this.authState$.subscribe(user => {
            if (user) {
                const userInfo: FirebaseUserInfo = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    isAnonymous: user.isAnonymous,
                    photoURL: user.photoURL,
                    emailVerified: user.emailVerified
                };
                this.currentUserSubject.next(userInfo);

                // 用戶登入後啟動自動 token 續簽
                this.startTokenRefresh();
            } else {
                this.currentUserSubject.next(null);

                // 用戶登出後停止自動 token 續簽
                this.stopTokenRefresh();
            }
        });
    }

    /**
     * 匿名登入
     */
    async signInAnonymously(): Promise<{ user: User; idToken: string; compatibleToken: string }> {
        try {
            const userCredential = await signInAnonymously(this.auth);
            const user = userCredential.user;
            const idToken = await user.getIdToken();
            const compatibleToken = this.createCompatibleJWT(user);

            return { user, idToken, compatibleToken };
        } catch (error) {
            console.error('Firebase 匿名登入失敗:', error);
            throw error;
        }
    }

    /**
     * Google 登入
     */
    async signInWithGoogle(): Promise<{ user: User; idToken: string; compatibleToken: string }> {
        try {
            const provider = new GoogleAuthProvider();
            // 設置 Google 登入的範圍
            provider.addScope('profile');
            provider.addScope('email');

            const userCredential = await signInWithPopup(this.auth, provider);
            const user = userCredential.user;
            const idToken = await user.getIdToken();
            const compatibleToken = this.createCompatibleJWT(user);

            return { user, idToken, compatibleToken };
        } catch (error) {
            console.error('Firebase Google 登入失敗:', error);
            throw error;
        }
    }

    /**
     * 登出
     */
    async signOut(): Promise<void> {
        try {
            await signOut(this.auth);
        } catch (error) {
            console.error('Firebase 登出失敗:', error);
            throw error;
        }
    }

    /**
     * 獲取當前用戶的 ID Token
     */
    async getCurrentUserIdToken(): Promise<string | null> {
        const user = this.auth.currentUser;
        if (user) {
            return await user.getIdToken();
        }
        return null;
    }

    /**
     * 獲取當前用戶
     */
    getCurrentUser(): User | null {
        return this.auth.currentUser;
    }

    /**
     * 刷新 ID Token
     */
    async refreshIdToken(): Promise<string | null> {
        const user = this.auth.currentUser;
        if (user) {
            return await user.getIdToken(true); // 強制刷新
        }
        return null;
    }

    /**
     * 啟動自動 token 續簽
     * 每 50 分鐘刷新一次 token（Firebase token 預設 1 小時過期）
     */
    private startTokenRefresh(): void {
        // 先停止之前的續簽
        this.stopTokenRefresh();

        console.log('🔥 啟動 Firebase Token 自動續簽機制');

        // 每 50 分鐘刷新一次 token
        this.tokenRefreshSubscription = interval(50 * 60 * 1000)
            .pipe(
                filter(() => !!this.auth.currentUser),
                switchMap(() => this.refreshAndUpdateToken())
            )
            .subscribe({
                next: (success) => {
                    if (success) {
                        console.log('🔥 Token 自動續簽成功');
                    } else {
                        console.warn('🔥 Token 自動續簽失敗');
                    }
                },
                error: (error) => {
                    console.error('🔥 Token 自動續簽過程中發生錯誤:', error);
                }
            });
    }

    /**
     * 停止自動 token 續簽
     */
    private stopTokenRefresh(): void {
        if (this.tokenRefreshSubscription) {
            this.tokenRefreshSubscription.unsubscribe();
            this.tokenRefreshSubscription = undefined;
            console.log('🔥 停止 Firebase Token 自動續簽機制');
        }
    }

    /**
     * 刷新並更新 token 到 SessionStorage
     */
    private async refreshAndUpdateToken(): Promise<boolean> {
        try {
            const user = this.auth.currentUser;
            if (!user) {
                return false;
            }

            // 強制刷新 Firebase ID Token
            const newIdToken = await user.getIdToken(true);

            // 創建新的兼容 token
            const newCompatibleToken = this.createCompatibleJWT(user);

            // 更新 SessionStorage 中的 token
            const fullToken = TokenPre + newCompatibleToken;
            this.windowService.setSessionStorage(TokenKey, fullToken);

            console.log('🔥 Token 已自動更新:', {
                uid: user.uid,
                newIdTokenLength: newIdToken.length,
                newCompatibleTokenLength: newCompatibleToken.length
            });

            return true;
        } catch (error) {
            console.error('🔥 刷新 token 失敗:', error);
            return false;
        }
    }

    /**
     * 手動刷新 token（供外部調用）
     */
    async manualRefreshToken(): Promise<boolean> {
        return await this.refreshAndUpdateToken();
    }

    /**
     * 創建兼容現有系統的 JWT token
     * 這個方法將 Firebase 用戶信息包裝成現有系統期望的 JWT 格式
     */
    createCompatibleJWT(user: User): string {
        // 創建一個模擬的 JWT payload，格式與後端返回的完全一致
        const payload = {
            userId: parseInt(user.uid.substring(0, 8), 16), // 將 Firebase UID 轉換為數字 ID
            rol: 'TabsDetail,SearchTableDetail', // 預設權限，與 ActionCode 對應
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24小時後過期
            iat: Math.floor(Date.now() / 1000)
        };

        // 創建標準的 JWT 格式（header.payload.signature）
        const header = {
            alg: 'HS256',
            typ: 'JWT'
        };

        // 使用 base64url 編碼（移除 padding）
        const headerEncoded = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
        const payloadEncoded = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

        // 使用簡單的簽名（在實際應用中應該使用真正的 HMAC）
        const signature = btoa('firebase-mock-signature').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

        return `${headerEncoded}.${payloadEncoded}.${signature}`;
    }

    /**
     * 清理資源（在服務銷毀時調用）
     */
    ngOnDestroy(): void {
        this.stopTokenRefresh();
    }
}