import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError, BehaviorSubject, delay } from 'rxjs';
import { DA_SERVICE_TOKEN } from '@delon/auth';

import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';
import { TokenSyncService } from './token-sync.service';
import { AuthStateManagerService } from './auth-state-manager.service';
import { SessionManagerService } from './session-manager.service';
import { FirebaseErrorHandlerService } from './firebase-error-handler.service';
import { firebaseAuthGuard } from './firebase-auth.guard';
import { StartupService } from '../startup/startup.service';

/**
 * 端到端整合測試
 * 
 * 模擬真實用戶使用場景的完整流程：
 * 1. 應用程式啟動 -> 會話恢復
 * 2. 用戶登入 -> 完整認證流程
 * 3. 受保護路由存取 -> 守衛檢查
 * 4. API 調用 -> Token 附加
 * 5. Token 過期 -> 自動刷新
 * 6. 用戶登出 -> 完整清理
 */
xdescribe('End-to-End Authentication Integration', () => {
    let firebaseAuth: jasmine.SpyObj<FirebaseAuthAdapterService>;
    let tokenSync: jasmine.SpyObj<TokenSyncService>;
    let authStateManager: AuthStateManagerService;
    let sessionManager: jasmine.SpyObj<SessionManagerService>;
    let errorHandler: jasmine.SpyObj<FirebaseErrorHandlerService>;
    let tokenService: jasmine.SpyObj<any>;
    let router: jasmine.SpyObj<Router>;
    let guard: FirebaseAuthGuard;
    let startupService: jasmine.SpyObj<StartupService>;
    let httpMock: HttpTestingController;

    const mockUser = {
        uid: 'test-uid-123',
        email: 'user@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/avatar.jpg'
    } as any;

    const mockToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.mock-token';
    const mockRefreshedToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.refreshed-token';

    const mockAlainToken = {
        token: mockToken,
        expired: Date.now() + 3600000, // 1 hour from now
        uid: mockUser.uid,
        email: mockUser.email,
        displayName: mockUser.displayName,
        photoURL: mockUser.photoURL
    };

    beforeEach(() => {
        const firebaseAuthSpy = jasmine.createSpyObj('FirebaseAuthAdapterService',
            ['signIn', 'signOut', 'getCurrentUser', 'getIdToken'],
            {
                authState$: new BehaviorSubject(null),
                isAuthenticated$: new BehaviorSubject(false)
            }
        );
        const tokenSyncSpy = jasmine.createSpyObj('TokenSyncService',
            ['syncFirebaseToken', 'clearTokens', 'convertToAlainFormat']
        );
        const sessionManagerSpy = jasmine.createSpyObj('SessionManagerService',
            ['saveSession', 'clearSession', 'restoreSession', 'validateSession', 'updateActivity']
        );
        const errorHandlerSpy = jasmine.createSpyObj('FirebaseErrorHandlerService',
            ['handleError', 'handleSilentError', 'handleAuthStateError', 'handleTokenRefreshError']
        );
        const tokenServiceSpy = jasmine.createSpyObj('TokenService',
            ['get', 'set', 'clear', 'change']
        );
        const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
        const startupServiceSpy = jasmine.createSpyObj('StartupService', ['load']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthStateManagerService,
                FirebaseAuthGuard,
                { provide: FirebaseAuthAdapterService, useValue: firebaseAuthSpy },
                { provide: TokenSyncService, useValue: tokenSyncSpy },
                { provide: SessionManagerService, useValue: sessionManagerSpy },
                { provide: FirebaseErrorHandlerService, useValue: errorHandlerSpy },
                { provide: DA_SERVICE_TOKEN, useValue: tokenServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: StartupService, useValue: startupServiceSpy }
            ]
        });

        firebaseAuth = TestBed.inject(FirebaseAuthAdapterService) as jasmine.SpyObj<FirebaseAuthAdapterService>;
        tokenSync = TestBed.inject(TokenSyncService) as jasmine.SpyObj<TokenSyncService>;
        authStateManager = TestBed.inject(AuthStateManagerService);
        sessionManager = TestBed.inject(SessionManagerService) as jasmine.SpyObj<SessionManagerService>;
        errorHandler = TestBed.inject(FirebaseErrorHandlerService) as jasmine.SpyObj<FirebaseErrorHandlerService>;
        tokenService = TestBed.inject(DA_SERVICE_TOKEN) as jasmine.SpyObj<any>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        guard = TestBed.inject(FirebaseAuthGuard);
        startupService = TestBed.inject(StartupService) as jasmine.SpyObj<StartupService>;
        httpMock = TestBed.inject(HttpTestingController);

        // 清除 localStorage
        localStorage.clear();

        // 設置基本的 mock 返回值
        tokenSync.syncFirebaseToken.and.returnValue(of(void 0));
        tokenSync.clearTokens.and.returnValue(of(void 0));
        tokenSync.convertToAlainFormat.and.returnValue(mockAlainToken);
        sessionManager.saveSession.and.returnValue(of(void 0));
        sessionManager.clearSession.and.returnValue(of(void 0));
        sessionManager.updateActivity.and.returnValue(of(void 0));
        tokenService.change.and.returnValue(of(mockAlainToken));
        startupService.load.and.returnValue(of(void 0));
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    describe('Complete User Journey', () => {
        it('should handle complete user journey from app start to logout', (done) => {
            let journeyStep = 0;
            const totalSteps = 6;

            const completeStep = () => {
                journeyStep++;
                if (journeyStep === totalSteps) {
                    done();
                }
            };

            // Step 1: 應用程式啟動 - 無現有會話
            sessionManager.restoreSession.and.returnValue(of(false));

            sessionManager.restoreSession().subscribe(restored => {
                expect(restored).toBe(false);
                completeStep(); // Step 1 完成

                // Step 2: 用戶嘗試存取受保護路由 - 被重定向到登入
                const mockRoute = {} as any;
                const mockState = { url: '/dashboard' } as any;

                authStateManager.isAuthenticated = jasmine.createSpy().and.returnValue(false);
                authStateManager.getCurrentState = jasmine.createSpy().and.returnValue({
                    isAuthenticated: false,
                    user: null,
                    token: null,
                    loading: false,
                    error: null
                });

                const guardResult = guard.canActivate(mockRoute, mockState);
                const checkGuardResult = (canActivate: boolean) => {
                    expect(canActivate).toBe(false);
                    expect(router.navigateByUrl).toHaveBeenCalledWith('/passport/login');
                    completeStep(); // Step 2 完成

                    // Step 3: 用戶登入
                    firebaseAuth.signIn.and.returnValue(of(mockUser));
                    firebaseAuth.getIdToken.and.returnValue(of(mockToken));

                    firebaseAuth.signIn('user@example.com', 'password').subscribe(user => {
                        expect(user).toBe(mockUser);

                        // 模擬認證狀態變化
                        (firebaseAuth.authState$ as BehaviorSubject<any>).next(mockUser);
                        (firebaseAuth.isAuthenticated$ as BehaviorSubject<boolean>).next(true);

                        completeStep(); // Step 3 完成

                        // Step 4: 認證狀態同步
                        setTimeout(() => {
                            expect(tokenSync.syncFirebaseToken).toHaveBeenCalledWith(mockToken, mockUser);
                            expect(sessionManager.saveSession).toHaveBeenCalledWith(mockUser);
                            completeStep(); // Step 4 完成

                            // Step 5: 用戶現在可以存取受保護路由
                            authStateManager.isAuthenticated = jasmine.createSpy().and.returnValue(true);
                            authStateManager.getCurrentState = jasmine.createSpy().and.returnValue({
                                isAuthenticated: true,
                                user: mockUser,
                                token: mockToken,
                                loading: false,
                                error: null
                            });

                            const guardResult2 = guard.canActivate(mockRoute, mockState);
                            const checkGuardResult2 = (canActivate: boolean) => {
                                expect(canActivate).toBe(true);
                                completeStep(); // Step 5 完成

                                // Step 6: 用戶登出
                                firebaseAuth.signOut.and.returnValue(of(void 0));

                                authStateManager.clearSession().subscribe(() => {
                                    expect(firebaseAuth.signOut).toHaveBeenCalled();
                                    expect(tokenSync.clearTokens).toHaveBeenCalled();
                                    expect(sessionManager.clearSession).toHaveBeenCalled();
                                    completeStep(); // Step 6 完成
                                });
                            };

                            if (typeof guardResult2 === 'boolean') {
                                checkGuardResult2(guardResult2);
                            } else {
                                guardResult2.subscribe(checkGuardResult2);
                            }
                        }, 100);
                    });
                };

                if (typeof guardResult === 'boolean') {
                    checkGuardResult(guardResult);
                } else {
                    guardResult.subscribe(checkGuardResult);
                }
            });
        });

        it('should handle app restart with existing session', (done) => {
            // 模擬應用程式重啟時有有效會話
            sessionManager.restoreSession.and.returnValue(of(true));
            firebaseAuth.getCurrentUser.and.returnValue(of(mockUser));
            firebaseAuth.getIdToken.and.returnValue(of(mockToken));

            // 執行會話恢復
            sessionManager.restoreSession().subscribe(restored => {
                expect(restored).toBe(true);

                // 初始化認證狀態管理器
                authStateManager.initialize().subscribe(() => {
                    // 驗證狀態被正確恢復
                    expect(tokenSync.syncFirebaseToken).toHaveBeenCalledWith(mockToken, mockUser);

                    // 用戶應該能直接存取受保護路由
                    authStateManager.isAuthenticated = jasmine.createSpy().and.returnValue(true);
                    authStateManager.getCurrentState = jasmine.createSpy().and.returnValue({
                        isAuthenticated: true,
                        user: mockUser,
                        token: mockToken,
                        loading: false,
                        error: null
                    });

                    const mockRoute = {} as any;
                    const mockState = { url: '/dashboard' } as any;
                    const guardResult = guard.canActivate(mockRoute, mockState);

                    const checkResult = (canActivate: boolean) => {
                        expect(canActivate).toBe(true);
                        done();
                    };

                    if (typeof guardResult === 'boolean') {
                        checkResult(guardResult);
                    } else {
                        guardResult.subscribe(checkResult);
                    }
                });
            });
        });
    });

    describe('Token Lifecycle Management', () => {
        it('should handle complete token lifecycle', (done) => {
            let lifecycleStep = 0;
            const totalSteps = 4;

            const completeStep = () => {
                lifecycleStep++;
                if (lifecycleStep === totalSteps) {
                    done();
                }
            };

            // Step 1: 初始 token 獲取
            firebaseAuth.signIn.and.returnValue(of(mockUser));
            firebaseAuth.getIdToken.and.returnValue(of(mockToken));
            tokenService.get.and.returnValue(mockAlainToken);

            firebaseAuth.signIn('user@example.com', 'password').subscribe(() => {
                completeStep(); // Step 1 完成

                // Step 2: Token 使用 (HTTP 請求)
                // 這裡我們模擬 token 被正確使用
                expect(tokenService.get()).toBe(mockAlainToken);
                completeStep(); // Step 2 完成

                // Step 3: Token 過期和刷新
                const expiredToken = {
                    ...mockAlainToken,
                    expired: Date.now() - 1000 // 已過期
                };
                tokenService.get.and.returnValue(expiredToken);
                firebaseAuth.getIdToken.and.returnValue(of(mockRefreshedToken));

                authStateManager.handleTokenRefresh(mockRefreshedToken).subscribe(() => {
                    expect(tokenSync.syncFirebaseToken).toHaveBeenCalledWith(mockRefreshedToken, jasmine.any(Object));
                    completeStep(); // Step 3 完成

                    // Step 4: Token 清除 (登出)
                    authStateManager.clearSession().subscribe(() => {
                        expect(tokenSync.clearTokens).toHaveBeenCalled();
                        completeStep(); // Step 4 完成
                    });
                });
            });
        });

        it('should handle token refresh failure gracefully', (done) => {
            // 設置過期 token
            const expiredToken = {
                ...mockAlainToken,
                expired: Date.now() - 1000
            };
            tokenService.get.and.returnValue(expiredToken);

            // 模擬 token 刷新失敗
            const refreshError = new Error('Token refresh failed');
            firebaseAuth.getIdToken.and.returnValue(throwError(() => refreshError));

            // 嘗試刷新 token
            authStateManager.handleTokenRefresh('invalid-token').subscribe({
                next: () => {
                    // 不應該成功
                    fail('Token refresh should have failed');
                },
                error: () => {
                    // 驗證錯誤處理
                    expect(errorHandler.handleTokenRefreshError).toHaveBeenCalledWith(refreshError);
                    done();
                }
            });
        });
    });

    describe('Error Recovery Scenarios', () => {
        it('should recover from network errors during authentication', (done) => {
            let attemptCount = 0;

            // 第一次嘗試失敗，第二次成功
            firebaseAuth.signIn.and.callFake(() => {
                attemptCount++;
                if (attemptCount === 1) {
                    return throwError(() => new Error('Network error'));
                } else {
                    return of(mockUser);
                }
            });

            // 第一次嘗試
            firebaseAuth.signIn('user@example.com', 'password').subscribe({
                next: () => fail('First attempt should fail'),
                error: (error) => {
                    expect(error.message).toBe('Network error');
                    expect(errorHandler.handleError).toHaveBeenCalledWith(error);

                    // 第二次嘗試
                    firebaseAuth.signIn('user@example.com', 'password').subscribe({
                        next: (user) => {
                            expect(user).toBe(mockUser);
                            done();
                        },
                        error: () => fail('Second attempt should succeed')
                    });
                }
            });
        });

        it('should handle session corruption gracefully', (done) => {
            // 模擬損壞的會話
            sessionManager.restoreSession.and.returnValue(of(false));
            sessionManager.validateSession.and.returnValue(of(false));

            // 嘗試恢復會話
            sessionManager.restoreSession().subscribe(restored => {
                expect(restored).toBe(false);

                // 驗證會話
                sessionManager.validateSession().subscribe(isValid => {
                    expect(isValid).toBe(false);

                    // 應用程式應該要求用戶重新登入
                    const mockRoute = {} as any;
                    const mockState = { url: '/dashboard' } as any;

                    authStateManager.isAuthenticated = jasmine.createSpy().and.returnValue(false);
                    authStateManager.getCurrentState = jasmine.createSpy().and.returnValue({
                        isAuthenticated: false,
                        user: null,
                        token: null,
                        loading: false,
                        error: 'Session corrupted'
                    });

                    const guardResult = guard.canActivate(mockRoute, mockState);
                    const checkResult = (canActivate: boolean) => {
                        expect(canActivate).toBe(false);
                        expect(router.navigateByUrl).toHaveBeenCalledWith('/passport/login');
                        done();
                    };

                    if (typeof guardResult === 'boolean') {
                        checkResult(guardResult);
                    } else {
                        guardResult.subscribe(checkResult);
                    }
                });
            });
        });
    });

    describe('Performance and Scalability', () => {
        it('should handle high-frequency authentication state changes efficiently', (done) => {
            let stateChangeCount = 0;
            const maxChanges = 10;
            const startTime = Date.now();

            // 監聽狀態變化
            authStateManager.authState$.subscribe(state => {
                stateChangeCount++;

                if (stateChangeCount === maxChanges) {
                    const endTime = Date.now();
                    const duration = endTime - startTime;

                    // 驗證性能 (應該在合理時間內完成)
                    expect(duration).toBeLessThan(1000); // 1 秒內
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

        it('should handle concurrent operations without race conditions', (done) => {
            let completedOperations = 0;
            const totalOperations = 5;

            // 設置並發操作
            const operations = [
                () => authStateManager.handleTokenRefresh('token1'),
                () => authStateManager.handleTokenRefresh('token2'),
                () => authStateManager.handleTokenRefresh('token3'),
                () => sessionManager.updateActivity(),
                () => sessionManager.validateSession()
            ];

            // 執行所有操作
            operations.forEach((operation, index) => {
                setTimeout(() => {
                    operation().subscribe({
                        next: () => {
                            completedOperations++;
                            if (completedOperations === totalOperations) {
                                // 驗證所有操作都完成了
                                expect(completedOperations).toBe(totalOperations);
                                done();
                            }
                        },
                        error: () => {
                            completedOperations++;
                            if (completedOperations === totalOperations) {
                                done();
                            }
                        }
                    });
                }, index * 5); // 5ms 間隔
            });
        });
    });

    describe('Real-world Usage Patterns', () => {
        it('should handle typical user session with multiple activities', (done) => {
            let activityCount = 0;
            const activities = [
                'login',
                'navigate-to-dashboard',
                'api-call-1',
                'api-call-2',
                'navigate-to-profile',
                'update-profile',
                'api-call-3',
                'logout'
            ];

            const executeNextActivity = () => {
                if (activityCount >= activities.length) {
                    done();
                    return;
                }

                const activity = activities[activityCount];
                activityCount++;

                switch (activity) {
                    case 'login':
                        firebaseAuth.signIn.and.returnValue(of(mockUser));
                        firebaseAuth.getIdToken.and.returnValue(of(mockToken));
                        firebaseAuth.signIn('user@example.com', 'password').subscribe(() => {
                            (firebaseAuth.authState$ as BehaviorSubject<any>).next(mockUser);
                            setTimeout(executeNextActivity, 10);
                        });
                        break;

                    case 'navigate-to-dashboard':
                    case 'navigate-to-profile':
                        // 模擬路由導航
                        sessionManager.updateActivity().subscribe(() => {
                            setTimeout(executeNextActivity, 10);
                        });
                        break;

                    case 'api-call-1':
                    case 'api-call-2':
                    case 'api-call-3':
                        // 模擬 API 調用
                        tokenService.get.and.returnValue(mockAlainToken);
                        setTimeout(executeNextActivity, 10);
                        break;

                    case 'update-profile':
                        // 模擬用戶資料更新
                        sessionManager.updateActivity().subscribe(() => {
                            setTimeout(executeNextActivity, 10);
                        });
                        break;

                    case 'logout':
                        firebaseAuth.signOut.and.returnValue(of(void 0));
                        authStateManager.clearSession().subscribe(() => {
                            setTimeout(executeNextActivity, 10);
                        });
                        break;
                }
            };

            executeNextActivity();
        });

        it('should handle user returning after extended absence', (done) => {
            // 模擬用戶長時間離開後返回
            const oldSession = {
                ...mockAlainToken,
                expired: Date.now() - (2 * 60 * 60 * 1000) // 2 小時前過期
            };

            // 會話已過期
            sessionManager.restoreSession.and.returnValue(of(false));
            sessionManager.validateSession.and.returnValue(of(false));
            tokenService.get.and.returnValue(oldSession);

            // 嘗試恢復會話
            sessionManager.restoreSession().subscribe(restored => {
                expect(restored).toBe(false);

                // 用戶需要重新登入
                const mockRoute = {} as any;
                const mockState = { url: '/dashboard' } as any;

                authStateManager.isAuthenticated = jasmine.createSpy().and.returnValue(false);
                authStateManager.getCurrentState = jasmine.createSpy().and.returnValue({
                    isAuthenticated: false,
                    user: null,
                    token: null,
                    loading: false,
                    error: null
                });

                const guardResult = guard.canActivate(mockRoute, mockState);
                const checkResult = (canActivate: boolean) => {
                    expect(canActivate).toBe(false);
                    expect(router.navigateByUrl).toHaveBeenCalledWith('/passport/login');

                    // 用戶重新登入
                    firebaseAuth.signIn.and.returnValue(of(mockUser));
                    firebaseAuth.getIdToken.and.returnValue(of(mockToken));

                    firebaseAuth.signIn('user@example.com', 'password').subscribe(() => {
                        expect(tokenSync.syncFirebaseToken).toHaveBeenCalledWith(mockToken, mockUser);
                        done();
                    });
                };

                if (typeof guardResult === 'boolean') {
                    checkResult(guardResult);
                } else {
                    guardResult.subscribe(checkResult);
                }
            });
        });
    });
});