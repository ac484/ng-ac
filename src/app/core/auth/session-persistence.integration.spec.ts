import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SessionManagerService } from './session-manager.service';
import { AuthStateManagerService } from './auth-state-manager.service';
import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';
import { FirebaseErrorHandlerService } from './firebase-error-handler.service';
import { TokenSyncService } from './token-sync.service';

/**
 * 會話持久化整合測試
 * 
 * 測試會話持久化功能的完整流程，包括：
 * - 會話保存和恢復
 * - 與認證狀態管理器的整合
 * - 錯誤處理和邊緣情況
 */
describe('Session Persistence Integration', () => {
    let sessionManager: SessionManagerService;
    let authStateManager: AuthStateManagerService;
    let mockFirebaseAuth: jasmine.SpyObj<FirebaseAuthAdapterService>;
    let mockTokenSync: jasmine.SpyObj<TokenSyncService>;
    let mockErrorHandler: jasmine.SpyObj<FirebaseErrorHandlerService>;

    const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/avatar.jpg'
    } as any;

    beforeEach(() => {
        const firebaseAuthSpy = jasmine.createSpyObj('FirebaseAuthAdapterService',
            ['getCurrentUser', 'getIdToken', 'signOut']
        );
        const tokenSyncSpy = jasmine.createSpyObj('TokenSyncService',
            ['syncFirebaseToken', 'clearTokens']
        );
        const errorHandlerSpy = jasmine.createSpyObj('FirebaseErrorHandlerService',
            ['handleSessionRestoreError', 'handleSilentError', 'handleAuthStateError', 'handleTokenRefreshError']
        );

        TestBed.configureTestingModule({
            providers: [
                SessionManagerService,
                AuthStateManagerService,
                { provide: FirebaseAuthAdapterService, useValue: firebaseAuthSpy },
                { provide: TokenSyncService, useValue: tokenSyncSpy },
                { provide: FirebaseErrorHandlerService, useValue: errorHandlerSpy }
            ]
        });

        sessionManager = TestBed.inject(SessionManagerService);
        authStateManager = TestBed.inject(AuthStateManagerService);
        mockFirebaseAuth = TestBed.inject(FirebaseAuthAdapterService) as jasmine.SpyObj<FirebaseAuthAdapterService>;
        mockTokenSync = TestBed.inject(TokenSyncService) as jasmine.SpyObj<TokenSyncService>;
        mockErrorHandler = TestBed.inject(FirebaseErrorHandlerService) as jasmine.SpyObj<FirebaseErrorHandlerService>;

        // 清除 localStorage
        localStorage.clear();

        // 模擬 navigator 物件
        spyOnProperty(navigator, 'userAgent', 'get').and.returnValue('test-user-agent');
        spyOnProperty(navigator, 'platform', 'get').and.returnValue('test-platform');
        spyOnProperty(navigator, 'language', 'get').and.returnValue('en-US');

        // 設置基本的 mock 返回值
        Object.defineProperty(mockFirebaseAuth, 'authState$', {
            get: () => of(null),
            configurable: true
        });
        mockTokenSync.syncFirebaseToken.and.returnValue(of(void 0));
        mockTokenSync.clearTokens.and.returnValue(of(void 0));
    });

    afterEach(() => {
        localStorage.clear();
    });

    describe('Complete Session Lifecycle', () => {
        it('should save, restore, and clear session correctly', (done) => {
            // 1. 保存會話
            sessionManager.saveSession(mockUser).subscribe(() => {
                // 驗證會話已保存
                const sessionInfo = sessionManager.getCurrentSessionInfo();
                expect(sessionInfo).toBeTruthy();
                expect(sessionInfo!.uid).toBe(mockUser.uid);

                // 2. 模擬應用程式重啟，恢復會話
                mockFirebaseAuth.getCurrentUser.and.returnValue(of(mockUser));

                sessionManager.restoreSession().subscribe(restored => {
                    expect(restored).toBe(true);

                    // 3. 清除會話
                    sessionManager.clearSession().subscribe(() => {
                        const clearedSession = sessionManager.getCurrentSessionInfo();
                        expect(clearedSession).toBeNull();
                        done();
                    });
                });
            });
        });

        it('should handle session expiration correctly', (done) => {
            // 手動創建過期會話
            const expiredSessionData = {
                uid: 'test-uid',
                email: 'test@example.com',
                lastActivity: Date.now() - (25 * 60 * 60 * 1000), // 25 小時前
                sessionId: 'session_123',
                version: '1.0.0',
                createdAt: Date.now() - (25 * 60 * 60 * 1000),
                deviceInfo: 'test-platform_en-US_15'
            };
            localStorage.setItem('firebase_auth_session', JSON.stringify(expiredSessionData));

            // 嘗試恢復過期會話
            sessionManager.restoreSession().subscribe(restored => {
                expect(restored).toBe(false);
                expect(sessionManager.getCurrentSessionInfo()).toBeNull();
                done();
            });
        });

        it('should handle device mismatch correctly', (done) => {
            // 創建來自不同設備的會話
            const differentDeviceSession = {
                uid: 'test-uid',
                email: 'test@example.com',
                lastActivity: Date.now() - (1000 * 60),
                sessionId: 'session_123',
                version: '1.0.0',
                createdAt: Date.now() - (1000 * 60),
                deviceInfo: 'different_device_info'
            };
            localStorage.setItem('firebase_auth_session', JSON.stringify(differentDeviceSession));

            // 嘗試恢復不同設備的會話
            sessionManager.restoreSession().subscribe(restored => {
                expect(restored).toBe(false);
                expect(sessionManager.getCurrentSessionInfo()).toBeNull();
                done();
            });
        });
    });

    describe('Session Activity Management', () => {
        it('should update session activity correctly', (done) => {
            sessionManager.saveSession(mockUser).subscribe(() => {
                const originalSession = sessionManager.getCurrentSessionInfo();
                const originalActivity = originalSession!.lastActivity;

                // 等待一小段時間後更新活動
                setTimeout(() => {
                    sessionManager.updateActivity().subscribe(() => {
                        const updatedSession = sessionManager.getCurrentSessionInfo();
                        expect(updatedSession!.lastActivity).toBeGreaterThan(originalActivity);
                        done();
                    });
                }, 10);
            });
        });

        it('should validate session integrity', (done) => {
            sessionManager.saveSession(mockUser).subscribe(() => {
                mockFirebaseAuth.getCurrentUser.and.returnValue(of(mockUser));

                sessionManager.validateSession().subscribe(isValid => {
                    expect(isValid).toBe(true);
                    done();
                });
            });
        });

        it('should cleanup expired sessions automatically', (done) => {
            // 創建過期會話
            const expiredSession = {
                uid: 'test-uid',
                email: 'test@example.com',
                lastActivity: Date.now() - (25 * 60 * 60 * 1000),
                sessionId: 'session_123',
                version: '1.0.0',
                createdAt: Date.now() - (25 * 60 * 60 * 1000),
                deviceInfo: 'test-platform_en-US_15'
            };
            localStorage.setItem('firebase_auth_session', JSON.stringify(expiredSession));

            sessionManager.cleanupExpiredSessions().subscribe(() => {
                expect(sessionManager.getCurrentSessionInfo()).toBeNull();
                done();
            });
        });
    });

    describe('Error Handling and Edge Cases', () => {
        it('should handle corrupted session data gracefully', (done) => {
            localStorage.setItem('firebase_auth_session', 'invalid-json');

            sessionManager.restoreSession().subscribe(restored => {
                expect(restored).toBe(false);
                done();
            });
        });

        it('should handle missing session fields gracefully', (done) => {
            const incompleteSession = {
                email: 'test@example.com',
                lastActivity: Date.now()
                // 缺少必要欄位
            };
            localStorage.setItem('firebase_auth_session', JSON.stringify(incompleteSession));

            sessionManager.restoreSession().subscribe(restored => {
                expect(restored).toBe(false);
                done();
            });
        });

        it('should handle localStorage errors gracefully', (done) => {
            spyOn(localStorage, 'setItem').and.throwError('Storage quota exceeded');

            sessionManager.saveSession(mockUser).subscribe(() => {
                expect(mockErrorHandler.handleSilentError).toHaveBeenCalled();
                done();
            });
        });
    });
});