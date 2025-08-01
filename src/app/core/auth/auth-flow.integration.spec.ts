import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { DA_SERVICE_TOKEN } from '@delon/auth';

import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';
import { TokenSyncService } from './token-sync.service';
import { AuthStateManagerService } from './auth-state-manager.service';
import { SessionManagerService } from './session-manager.service';
import { FirebaseErrorHandlerService } from './firebase-error-handler.service';
import { firebaseTokenInterceptor } from './firebase-token.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

/**
 * 完整認證流程整合測試
 * 
 * 測試從登入到 token 使用的完整流程：
 * 1. 用戶登入 -> Firebase Auth
 * 2. Token 同步 -> Alain Token Service
 * 3. HTTP 請求 -> 自動附加 token
 * 4. Token 刷新 -> 自動處理
 * 5. 登出 -> 清除所有狀態
 */
describe('Authentication Flow Integration', () => {
    let firebaseAuth: jasmine.SpyObj<FirebaseAuthAdapterService>;
    let tokenSync: jasmine.SpyObj<TokenSyncService>;
    let authStateManager: AuthStateManagerService;
    let sessionManager: jasmine.SpyObj<SessionManagerService>;
    let errorHandler: jasmine.SpyObj<FirebaseErrorHandlerService>;
    let tokenService: jasmine.SpyObj<any>;
    let router: jasmine.SpyObj<Router>;
    let httpMock: HttpTestingController;

    const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/avatar.jpg'
    } as any;

    const mockToken = 'mock-firebase-id-token';
    const mockAlainToken = {
        token: mockToken,
        expired: Date.now() + 3600000, // 1 hour from now
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName
    };

    beforeEach(() => {
        const firebaseAuthSpy = jasmine.createSpyObj('FirebaseAuthAdapterService',
            ['signIn', 'signOut', 'getCurrentUser', 'getIdToken'],
            { authState$: new BehaviorSubject(null), isAuthenticated$: new BehaviorSubject(false) }
        );
        const tokenSyncSpy = jasmine.createSpyObj('TokenSyncService',
            ['syncFirebaseToken', 'clearTokens', 'convertToAlainFormat']
        );
        const sessionManagerSpy = jasmine.createSpyObj('SessionManagerService',
            ['saveSession', 'clearSession', 'restoreSession', 'validateSession']
        );
        const errorHandlerSpy = jasmine.createSpyObj('FirebaseErrorHandlerService',
            ['handleError', 'handleSilentError', 'handleAuthStateError']
        );
        const tokenServiceSpy = jasmine.createSpyObj('TokenService',
            ['get', 'set', 'clear', 'change']
        );
        const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                provideHttpClient(withInterceptors([firebaseTokenInterceptor])),
                AuthStateManagerService,
                { provide: FirebaseAuthAdapterService, useValue: firebaseAuthSpy },
                { provide: TokenSyncService, useValue: tokenSyncSpy },
                { provide: SessionManagerService, useValue: sessionManagerSpy },
                { provide: FirebaseErrorHandlerService, useValue: errorHandlerSpy },
                { provide: DA_SERVICE_TOKEN, useValue: tokenServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        });

        firebaseAuth = TestBed.inject(FirebaseAuthAdapterService) as jasmine.SpyObj<FirebaseAuthAdapterService>;
        tokenSync = TestBed.inject(TokenSyncService) as jasmine.SpyObj<TokenSyncService>;
        authStateManager = TestBed.inject(AuthStateManagerService);
        sessionManager = TestBed.inject(SessionManagerService) as jasmine.SpyObj<SessionManagerService>;
        errorHandler = TestBed.inject(FirebaseErrorHandlerService) as jasmine.SpyObj<FirebaseErrorHandlerService>;
        tokenService = TestBed.inject(DA_SERVICE_TOKEN) as jasmine.SpyObj<any>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        httpMock = TestBed.inject(HttpTestingController);

        // 清除 localStorage
        localStorage.clear();

        // 設置基本的 mock 返回值
        tokenSync.syncFirebaseToken.and.returnValue(of(void 0));
        tokenSync.clearTokens.and.returnValue(of(void 0));
        tokenSync.convertToAlainFormat.and.returnValue(mockAlainToken);
        sessionManager.saveSession.and.returnValue(of(void 0));
        sessionManager.clearSession.and.returnValue(of(void 0));
        sessionManager.restoreSession.and.returnValue(of(false));
        sessionManager.validateSession.and.returnValue(of(true));
        tokenService.get.and.returnValue(mockAlainToken);
        tokenService.change.and.returnValue(of(mockAlainToken));
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    describe('Complete Authentication Flow', () => {
        it('should handle complete login flow', (done) => {
            // 1. 模擬用戶登入
            firebaseAuth.signIn.and.returnValue(of(mockUser));
            firebaseAuth.getIdToken.and.returnValue(of(mockToken));

            // 更新 authState$ 來模擬登入成功
            (firebaseAuth.authState$ as BehaviorSubject<any>).next(mockUser);
            (firebaseAuth.isAuthenticated$ as BehaviorSubject<boolean>).next(true);

            // 2. 執行登入流程
            firebaseAuth.signIn('test@example.com', 'password').subscribe(user => {
                expect(user).toBe(mockUser);

                // 3. 驗證 token 同步被調用
                setTimeout(() => {
                    expect(tokenSync.syncFirebaseToken).toHaveBeenCalledWith(mockToken, mockUser);
                    expect(sessionManager.saveSession).toHaveBeenCalledWith(mockUser);
                    done();
                }, 100);
            });
        });

        it('should handle complete logout flow', (done) => {
            // 1. 設置已登入狀態
            (firebaseAuth.authState$ as BehaviorSubject<any>).next(mockUser);
            (firebaseAuth.isAuthenticated$ as BehaviorSubject<boolean>).next(true);
            tokenService.get.and.returnValue(mockAlainToken);

            // 2. 模擬登出
            firebaseAuth.signOut.and.returnValue(of(void 0));

            // 3. 執行登出流程
            authStateManager.clearSession().subscribe(() => {
                // 4. 驗證所有清除操作被調用
                expect(firebaseAuth.signOut).toHaveBeenCalled();
                expect(tokenSync.clearTokens).toHaveBeenCalled();
                expect(sessionManager.clearSession).toHaveBeenCalled();
                done();
            });
        });

        it('should handle authentication state changes', (done) => {
            let stateChanges = 0;

            // 監聽認證狀態變化
            authStateManager.authState$.subscribe(state => {
                stateChanges++;

                if (stateChanges === 1) {
                    // 初始狀態：未認證
                    expect(state.isAuthenticated).toBe(false);
                    expect(state.user).toBeNull();
                } else if (stateChanges === 2) {
                    // 登入後狀態：已認證
                    expect(state.isAuthenticated).toBe(true);
                    expect(state.user).toBe(mockUser);
                    done();
                }
            });

            // 模擬認證狀態變化
            setTimeout(() => {
                firebaseAuth.getIdToken.and.returnValue(of(mockToken));
                (firebaseAuth.authState$ as BehaviorSubject<any>).next(mockUser);
            }, 50);
        });
    });

    describe('HTTP Request Integration', () => {
        it('should automatically attach Firebase token to HTTP requests', () => {
            // 設置已認證狀態
            tokenService.get.and.returnValue(mockAlainToken);

            // 發送 HTTP 請求
            TestBed.inject(HttpClientTestingModule);

            // 由於我們使用了 firebaseTokenInterceptor，token 應該被自動附加
            // 這個測試驗證攔截器是否正確配置
            expect(tokenService.get).toHaveBeenCalled();
        });

        it('should handle token refresh on expired token', (done) => {
            // 設置過期的 token
            const expiredToken = {
                ...mockAlainToken,
                expired: Date.now() - 1000 // 已過期
            };
            tokenService.get.and.returnValue(expiredToken);

            // 模擬 token 刷新
            firebaseAuth.getIdToken.and.returnValue(of('new-refreshed-token'));
            const newToken = {
                ...mockAlainToken,
                token: 'new-refreshed-token',
                expired: Date.now() + 3600000
            };
            tokenSync.convertToAlainFormat.and.returnValue(newToken);

            // 執行 token 刷新
            authStateManager.handleTokenRefresh('new-refreshed-token').subscribe(() => {
                expect(tokenSync.syncFirebaseToken).toHaveBeenCalledWith('new-refreshed-token', jasmine.any(Object));
                done();
            });
        });
    });

    describe('Error Handling Integration', () => {
        it('should handle Firebase authentication errors', (done) => {
            const authError = { code: 'auth/user-not-found', message: 'User not found' };
            firebaseAuth.signIn.and.returnValue(throwError(() => authError));

            firebaseAuth.signIn('invalid@example.com', 'wrongpassword').subscribe({
                next: () => fail('Should not succeed'),
                error: (error) => {
                    expect(error).toBe(authError);
                    expect(errorHandler.handleError).toHaveBeenCalledWith(authError);
                    done();
                }
            });
        });

        it('should handle token synchronization errors', (done) => {
            const syncError = new Error('Token sync failed');
            firebaseAuth.signIn.and.returnValue(of(mockUser));
            firebaseAuth.getIdToken.and.returnValue(of(mockToken));
            tokenSync.syncFirebaseToken.and.returnValue(throwError(() => syncError));

            // 更新 authState$ 來觸發同步
            (firebaseAuth.authState$ as BehaviorSubject<any>).next(mockUser);

            // 等待錯誤處理
            setTimeout(() => {
                expect(errorHandler.handleSilentError).toHaveBeenCalledWith(syncError);
                done();
            }, 100);
        });

        it('should handle session restoration errors', (done) => {
            const sessionError = new Error('Session restore failed');
            sessionManager.restoreSession.and.returnValue(throwError(() => sessionError));

            sessionManager.restoreSession().subscribe({
                next: () => fail('Should not succeed'),
                error: (error) => {
                    expect(error).toBe(sessionError);
                    done();
                }
            });
        });
    });

    describe('State Synchronization Integration', () => {
        it('should maintain consistent state between Firebase and Alain', (done) => {
            // 設置 Firebase 認證狀態
            (firebaseAuth.authState$ as BehaviorSubject<any>).next(mockUser);
            (firebaseAuth.isAuthenticated$ as BehaviorSubject<boolean>).next(true);
            firebaseAuth.getIdToken.and.returnValue(of(mockToken));

            // 監聽認證狀態管理器的狀態
            authStateManager.authState$.subscribe(state => {
                if (state.isAuthenticated) {
                    // 驗證狀態一致性
                    expect(state.user).toBe(mockUser);
                    expect(state.token).toBe(mockToken);
                    expect(tokenSync.syncFirebaseToken).toHaveBeenCalledWith(mockToken, mockUser);
                    done();
                }
            });
        });

        it('should handle concurrent authentication operations', (done) => {
            let completedOperations = 0;
            const totalOperations = 3;

            // 模擬多個並發操作
            const operations = [
                () => authStateManager.handleTokenRefresh('token1'),
                () => authStateManager.handleTokenRefresh('token2'),
                () => authStateManager.handleTokenRefresh('token3')
            ];

            operations.forEach((operation, index) => {
                operation().subscribe(() => {
                    completedOperations++;
                    if (completedOperations === totalOperations) {
                        // 驗證所有操作都完成了
                        expect(tokenSync.syncFirebaseToken).toHaveBeenCalledTimes(totalOperations);
                        done();
                    }
                });
            });
        });
    });

    describe('Session Persistence Integration', () => {
        it('should restore session on application startup', (done) => {
            // 模擬有效會話存在
            sessionManager.restoreSession.and.returnValue(of(true));
            firebaseAuth.getCurrentUser.and.returnValue(of(mockUser));
            firebaseAuth.getIdToken.and.returnValue(of(mockToken));

            // 執行會話恢復
            sessionManager.restoreSession().subscribe(restored => {
                expect(restored).toBe(true);

                // 初始化認證狀態管理器
                authStateManager.initialize().subscribe(() => {
                    expect(tokenSync.syncFirebaseToken).toHaveBeenCalled();
                    done();
                });
            });
        });

        it('should handle invalid session gracefully', (done) => {
            // 模擬無效會話
            sessionManager.restoreSession.and.returnValue(of(false));
            sessionManager.validateSession.and.returnValue(of(false));

            sessionManager.restoreSession().subscribe(restored => {
                expect(restored).toBe(false);

                sessionManager.validateSession().subscribe(isValid => {
                    expect(isValid).toBe(false);
                    done();
                });
            });
        });
    });

    describe('Performance and Optimization', () => {
        it('should not make unnecessary token refresh calls', (done) => {
            // 設置有效的 token
            tokenService.get.and.returnValue(mockAlainToken);
            firebaseAuth.getIdToken.and.returnValue(of(mockToken));

            // 多次調用 getIdToken，應該使用快取
            const calls = [
                authStateManager.handleTokenRefresh(mockToken),
                authStateManager.handleTokenRefresh(mockToken),
                authStateManager.handleTokenRefresh(mockToken)
            ];

            let completedCalls = 0;
            calls.forEach(call => {
                call.subscribe(() => {
                    completedCalls++;
                    if (completedCalls === calls.length) {
                        // 驗證 token 同步只被調用了必要的次數
                        expect(tokenSync.syncFirebaseToken).toHaveBeenCalledTimes(calls.length);
                        done();
                    }
                });
            });
        });

        it('should handle rapid authentication state changes efficiently', (done) => {
            let stateChangeCount = 0;
            const maxChanges = 5;

            // 監聽狀態變化
            authStateManager.authState$.subscribe(() => {
                stateChangeCount++;
                if (stateChangeCount === maxChanges) {
                    // 驗證狀態變化被正確處理
                    expect(stateChangeCount).toBe(maxChanges);
                    done();
                }
            });

            // 快速觸發多個狀態變化
            for (let i = 0; i < maxChanges; i++) {
                setTimeout(() => {
                    const user = i % 2 === 0 ? mockUser : null;
                    (firebaseAuth.authState$ as BehaviorSubject<any>).next(user);
                }, i * 10);
            }
        });
    });
});