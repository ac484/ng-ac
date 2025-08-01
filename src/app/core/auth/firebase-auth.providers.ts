import { Provider } from '@angular/core';
import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';
import { TokenSyncService } from './token-sync.service';
import { AuthStateManagerService } from './auth-state-manager.service';
import { SessionManagerService } from './session-manager.service';
import { FirebaseErrorHandlerService } from './firebase-error-handler.service';

/**
 * Firebase Auth 整合提供者
 * 
 * 提供 Firebase Auth 整合所需的所有服務
 * 遵循精簡主義原則，僅包含必要的服務配置
 */
export function provideFirebaseAuthIntegration(): Provider[] {
    return [
        FirebaseAuthAdapterService,
        TokenSyncService,
        AuthStateManagerService,
        SessionManagerService,
        FirebaseErrorHandlerService
    ];
}