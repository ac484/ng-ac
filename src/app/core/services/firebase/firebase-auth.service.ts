import { Injectable, inject } from '@angular/core';
import { Auth, User, authState, signInAnonymously, signOut } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

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
    private currentUserSubject = new BehaviorSubject<FirebaseUserInfo | null>(null);

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
            } else {
                this.currentUserSubject.next(null);
            }
        });
    }

    /**
     * 匿名登入
     */
    async signInAnonymously(): Promise<{ user: User; idToken: string }> {
        try {
            const userCredential = await signInAnonymously(this.auth);
            const user = userCredential.user;
            const idToken = await user.getIdToken();

            return { user, idToken };
        } catch (error) {
            console.error('Firebase 匿名登入失敗:', error);
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
}