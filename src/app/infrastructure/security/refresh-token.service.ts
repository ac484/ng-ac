/**
 * @fileoverview 刷新 Token 服務 (Refresh Token Service)
 * @description 透過 Firebase 強制刷新 ID Token
 */

import { Injectable } from '@angular/core';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class RefreshTokenService {
    constructor(private readonly tokenService: TokenService) {}

    async refresh(): Promise<string | null> {
        return this.tokenService.getIdToken(true);
    }
}


