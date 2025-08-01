import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';
import { AuthStateManagerService } from './auth-state-manager.service';
import { TokenSyncService } from './token-sync.service';
import { SessionManagerService } from './session-manager.service';
import { firebaseTokenInterceptor } from './firebase-token.interceptor';

/**
 * Firebase Auth 整合測試
 * 
 * 遵循精簡主義原則，專注於核心整合功能：
 * 1. 完整認證流程測試
 * 2. Token 刷新機制測試
 * 3. 會話持久化測試
 * 4. 錯誤處理測試
 */
describe('Firebase Auth Integration Tests', () => {
    let httpClient: HttpClient;
    let httpMock: HttpTestingController;
    let firebaseAuth: jasmine.SpyObj<FirebaseAuthAdapterService>;
    let authStateManager: AuthStateManagerService;
    let tokenSync: jasmine.SpyObj<TokenSyncService>;
    let sessionManager: jasmine.SpyObj<SessionManagerService>;
    let tokenService: jasmine.SpyObj<any>;

    const mockUser = {
        uid: 'test-uid-123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/avatar.jpg'
    } as any;

    const mockToken = 'mock-firebase-id-token';
    const mockAlainToken = {
        token: mockToken,
        expired: Date.now() + 3600000, // 1 hour from now
        uid: mockUser.uid,
        email: mockUser.email
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
            ['saveSession', 'clearSession', 'restoreSession']
        );
        const tokenServiceSpy = jasmine.createSpyObj('TokenService',
            ['get', 'set', 'clear']
        );

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                provideHttpClient(withInterceptors([firebaseTokenInterceptor])),
                AuthStateManagerService,
                { provide: FirebaseAuthAdapterService, useValue: firebaseAuthSpy },
                { provide: TokenSyncService, useValue: tokenSyncSpy },
                { provide: SessionManagerService, useValue: sessionManagerSpy },
                { provide: DA_SERVICE_TOKEN, useValue: tokenServiceSpy }
            ]
        });

        httpClient = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
        firebaseAuth = TestBed.inject(FirebaseAuthAdapterService) as jasmine.SpyObj<FirebaseAuthAdapterService>;
        authStateManager = TestBed.inject(AuthStateManagerService);
        tokenSync = TestBed.inject(TokenSyncService) as jasmine.SpyObj<TokenSyncService>;
        sessionManager = TestBed.inject(SessionManagerService) as jasmine.SpyObj<SessionManagerService>;
        tokenService = TestBed.inject(DA_SERVICE_TOKEN) as jasmine.SpyObj<any>;

        // 設置基本 mock 返回值
        tokenSync.syncFirebaseToken.and.returnValue(of(void 0));
        tokenSync.clearTokens.and.returnValue(of(void 0));
        tokenSync.convertToAlainFormat.and.returnValue(mockAlainToken);
        sessionManager.saveSession.and.returnValue(of(void 0));
        sessionManager.clearSession.and.returnValue(of(void 0));
        sessionManager.restoreSession.and.returnValue(of(false));
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('Complete Authentication Flow', () => {
        it('should handle complete login to API call flow', (done) => {
            // Step 1: 用戶登入
            firebaseAuth.signIn.and.returnValue(of(mockUser));
            firebaseAuth.getIdToken.and.returnValue(of(mockToken));

            firebaseAuth.signIn('test@example.com', 'password').subscribe(user => {
                expect(user).toBe(mockUser);

                // 模擬 Firebase Auth 狀態變化
                (firebaseAuth.authState$ as BehaviorSubject<any>).next(mockUser);
                (firebaseAuth.isAuthenticated$ as BehaviorSubject<boolean>).next(true);

                // Step 2: 驗證 token 同步
                setTimeout(() => {
                    expect(tokenSync.syncFirebaseToken).toHaveBeenCalledWith(mockToken, mockUser);
                    expect(sessionManager.saveSession).toHaveBeenCalledWith(mockUser);

                    // Step 3: 測試 HTTP 請求附加 token
                    tokenService.get.and.returnValue(mockAlainToken);

                    httpClient.get('/api/protected-data').subscribe(response => {
                        expect(response).toEqual({ data: 'success' });
                        done();
                    });

                    const req = httpMock.expectOne('/api/protected-data');
                    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
                    req.flush({ data: 'success' });
                }, 10);
            });
        });

        it('should handle token refresh on expired token', (done) => {
            // 設置過期 token
            const expiredToken = {
                ...mockAlainToken,
                expired: Date.now() - 1000 // 已過期
            };
            tokenService.get.and.returnValue(expiredToken);

            // 模擬 token 刷新
            const newToken = 'new-refreshed-token';
            firebaseAuth.getIdToken.and.returnValue(of(newToken));

            httpClient.get('/api/test').subscribe(response => {
                expect(response).toEqual({ success: true });
                done();
            });

            // 第一個請求應該使用過期 token
            const req1 = httpMock.expectOne('/api/test');
            expect(req1.request.headers.get('Authorization')).toBe(`Bearer ${expiredToken.token}`);

            // 模擬 401 響應觸發 token 刷新
            req1.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

            // 驗證 token 刷新被調用
            setTimeout(() => {
                expect(firebaseAuth.getIdToken).toHaveBeenCalledWith(true);

                // 重試請求應該使用新 token
                const req2 = httpMock.expectOne('/api/test');
                expect(req2.request.headers.get('Authorization')).toBe(`Bearer ${newToken}`);
                req2.flush({ success: true });
            }, 10);
        });

        it('should handle complete logout flow', (done) => {
            // 設置已認證狀態
            (firebaseAuth.authState$ as BehaviorSubject<any>).next(mockUser);
            (firebaseAuth.isAuthenticated$ as BehaviorSubject<boolean>).next(true);

            // 執行登出
            firebaseAuth.signOut.and.returnValue(of(void 0));

            authStateManager.clearSession().subscribe(() => {
                // 驗證所有清理操作被調用
                expect(firebaseAuth.signOut).toHaveBeenCalled();
                expect(tokenSync.clearTokens).toHaveBeenCalled();
                expect(sessionManager.clearSession).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('Session Persistence Integration', () => {
        it('should restore session on app startup', (done) => {
            // 模擬有效會話存在
            sessionManager.restoreSession.and.returnValue(of(true));
            firebaseAuth.getCurrentUser.and.returnValue(of(mockUser));
            firebaseAuth.getIdToken.and.returnValue(of(mockToken));

            sessionManager.restoreSession().subscribe(restored => {
                expect(restored).toBe(true);

                // 初始化認證狀態管理器
                authStateManager.initialize().subscribe(() => {
                    expect(tokenSync.syncFirebaseToken).toHaveBeenCalledWith(mockToken, mockUser);
                    done();
                });
            });
        });

        it('should handle invalid session gracefully', (done) => {
            // 模擬無效會話
            sessionManager.restoreSession.and.returnValue(of(false));

            sessionManager.restoreSession().subscribe(restored => {
                expect(restored).toBe(false);

                // 應用程式應該正常啟動，無認證狀態
                const currentState = authStateManager.getCurrentState();
                expect(currentState.isAuthenticated).toBe(false);
                done();
            });
        });
    });

    describe('Error Handling Integration', () => {
        it('should handle authentication errors gracefully', (done) => {
            // 模擬登入失敗
            const authError = new Error('Authentication failed');
            firebaseAuth.signIn.and.returnValue(throwError(() => authError));

            firebaseAuth.signIn('invalid@example.com', 'wrongpassword').subscribe({
                next: () => fail('Should not succeed'),
                error: (error) => {
                    expect(error).toBe(authError);

                    // 驗證認證狀態保持未認證
                    const currentState = authStateManager.getCurrentState();
                    expect(currentState.isAuthenticated).toBe(false);
                    expect(currentState.error).toBeTruthy();
                    done();
                }
            });
        });

        it('should handle token refresh failures', (done) => {
            // 設置過期 token
            const expiredToken = {
                ...mockAlainToken,
                expired: Date.now() - 1000
            };
            tokenService.get.and.returnValue(expiredToken);

            // 模擬 token 刷新失敗
            const refreshError = new Error('Token refresh failed');
            firebaseAuth.getIdToken.and.returnValue(throwError(() => refreshError));

            httpClient.get('/api/test').subscribe({
                next: () => fail('Should not succeed'),
                error: (error) => {
                    expect(error.status).toBe(401);
                    done();
                }
            });

            const req = httpMock.expectOne('/api/test');
            req.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
        });
    });

    describe('State Synchronization', () => {
        it('should maintain consistent state between Firebase and Alain', (done) => {
            // 初始狀態應該是未認證
            expect(authStateManager.getCurrentState().isAuthenticated).toBe(false);

            // 模擬 Firebase 認證狀態變化
            (firebaseAuth.authState$ as BehaviorSubject<any>).next(mockUser);
            (firebaseAuth.isAuthenticated$ as BehaviorSubject<boolean>).next(true);

            // 等待狀態同步
            setTimeout(() => {
                const currentState = authStateManager.getCurrentState();
                expect(currentState.isAuthenticated).toBe(true);
                expect(currentState.user).toBe(mockUser);
                done();
            }, 10);
        });

        it('should handle Firebase auth state changes', (done) => {
            // 設置初始認證狀態
            (firebaseAuth.authState$ as BehaviorSubject<any>).next(mockUser);
            (firebaseAuth.isAuthenticated$ as BehaviorSubject<boolean>).next(true);

            setTimeout(() => {
                expect(authStateManager.getCurrentState().isAuthenticated).toBe(true);

                // 模擬用戶登出
                (firebaseAuth.authState$ as BehaviorSubject<any>).next(null);
                (firebaseAuth.isAuthenticated$ as BehaviorSubject<boolean>).next(false);

                setTimeout(() => {
                    expect(authStateManager.getCurrentState().isAuthenticated).toBe(false);
                    done();
                }, 10);
            }, 10);
        });
    });
});