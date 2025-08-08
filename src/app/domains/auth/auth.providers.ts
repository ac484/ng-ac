import { Provider } from '@angular/core';

import { AuthBridgeService } from './application/services/auth-bridge.service';
import { LoginUseCase } from './application/use-cases/login.use-case';

/**
 * 認證模組提供者
 * 統一管理認證相關的依賴注入
 */
export const AUTH_PROVIDERS: Provider[] = [AuthBridgeService, LoginUseCase];

/**
 * 認證模組配置
 */
export interface AuthModuleConfig {
  enableFirebaseAuth: boolean;
  enableGoogleLogin: boolean;
  adminEmail: string;
  adminPassword: string;
}

/**
 * 預設認證配置
 */
export const DEFAULT_AUTH_CONFIG: AuthModuleConfig = {
  enableFirebaseAuth: true,
  enableGoogleLogin: true,
  adminEmail: 'admin@company.com',
  adminPassword: '123456'
};
