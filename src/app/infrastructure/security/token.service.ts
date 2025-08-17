/**
 * @fileoverview Token 發放與管理服務 (Token Service)
 * @description 與 Firebase Auth 對接，提供 issue/getIdToken/clear 能力
 */

import { Injectable } from '@angular/core';
import { User } from '@angular/fire/auth';
import { FirebaseAuthService } from '../persistence/firebase';

@Injectable({ providedIn: 'root' })
export class TokenService {
    constructor(private readonly firebaseAuth: FirebaseAuthService) {}

    /**
     * 使用憑證發放使用者會話（最小實作：email/password）
     */
    async issue(email: string, password: string): Promise<User | null> {
        return this.firebaseAuth.login(email, password);
    }

    /**
     * 取得目前使用者之 ID Token
     */
    async getIdToken(forceRefresh = false): Promise<string | null> {
        const user = this.firebaseAuth.getCurrentUser();
        if (!user) {
            return null;
        }
        try {
            return await user.getIdToken(forceRefresh);
        } catch (err) {
            console.error('getIdToken 失敗:', err);
            return null;
        }
    }

    /**
     * 清除目前會話
     */
    async clear(): Promise<void> {
        await this.firebaseAuth.logout();
    }
}


