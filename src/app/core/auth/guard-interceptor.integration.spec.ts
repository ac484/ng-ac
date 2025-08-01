import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { DA_SERVICE_TOKEN } from '@delon/auth';

import { firebaseAuthGuard } from './firebase-auth.guard';
import { firebaseTokenInterceptor } from './firebase-token.interceptor';
import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';
import { AuthStateManagerService } from './auth-state-manager.service';
import { FirebaseErrorHandlerService } from './firebase-error-handler.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

/**
 * 守衛和攔截器整合測試
 * 
 * 測試路由守衛和 HTTP 攔截器的整合：
 * 1. 路由保護 -> Firebase Auth 狀態檢查
 * 2. HTTP 請求 -> 自動 token 附加
 * 3. Token 過期 -> 自動刷新
 * 4. 認證失敗 -> 重定向處理
 */
xdescribe('Guard and Interceptor Integration', () => {
    let guard: typeof firebaseAuthGuard;
    let httpClient: HttpClient;
    let httpMock: HttpTestingController;
    let firebaseAuth: jasmine.SpyObj<FirebaseAuthAdapterService>;
    let authStateManager: jasmine.SpyObj<AuthStateManagerService>;
    let errorHandler: jasmine.SpyObj<FirebaseErrorHandlerService>;
    let tokenService: jasmine.SpyObj<any>;
    let router: jasmine.SpyObj<Router>;

    const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User'
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
            ['getCurrentUser', 'getIdToken'],
            {
                authState$: new BehaviorSubject(null),
                isAuthenticated$: new BehaviorSubject(false)
            }
        );
        const authStateManagerSpy = jasmine.createSpyObj('AuthStateManagerService',
            ['getCurrentState', 'isAuthenticated', 'handleTokenRefresh']
        );
        const errorHandlerSpy = jasmine.createSpyObj('FirebaseErrorHandlerService',
            ['handleError', 'handleSilentError', 'handleTokenRefreshError']
        );
        const tokenServiceSpy = jasmine.createSpyObj('TokenService',
            ['get', 'set', 'clear']
        );
        const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                provideHttpClient(withInterceptors([firebaseTokenInterceptor])),

                { provide: FirebaseAuthAdapterService, useValue: firebaseAuthSpy },
                { provide: AuthStateManagerService, useValue: authStateManagerSpy },
                { provide: FirebaseErrorHandlerService, useValue: errorHandlerSpy },
                { provide: DA_SERVICE_TOKEN, useValue: tokenServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        });

        guard = firebaseAuthGuard;
        httpClient = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
        firebaseAuth = TestBed.inject(FirebaseAuthAdapterService) as jasmine.SpyObj<FirebaseAuthAdapterService>;
        authStateManager = TestBed.inject(AuthStateManagerService) as jasmine.SpyObj<AuthStateManagerService>;
        errorHandler = TestBed.inject(FirebaseErrorHandlerService) as jasmine.SpyObj<FirebaseErrorHandlerService>;
        tokenService = TestBed.inject(DA_SERVICE_TOKEN) as jasmine.SpyObj<any>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    afterEach(() => {
        httpMock.verify();
    });

    describe('Route Guard Integration', () => {
        let mockRoute: ActivatedRouteSnapshot;
        let mockState: RouterStateSnapshot;

        beforeEach(() => {
            mockRoute = {} as ActivatedRouteSnapshot;
            mockState = { url: '/protected-route' } as RouterStateSnapshot;
        });

        it('should allow access when user is authenticated', (done) => {
            // 設置已認證狀態
            authStateManager.isAuthenticated.and.returnValue(true);
            authStateManager.getCurrentState.and.returnValue({
                isAuthenticated: true,
                user: mockUser,
                token: mockToken,
                loading: false,
                error: null
            });

            // 執行守衛檢查
            const result = guard.canActivate(mockRoute, mockState);

            if (typeof result === 'boolean') {
                expect(result).toBe(true);
                done();
            } else {
                result.subscribe(canActivate => {
                    expect(canActivate).toBe(true);
                    done();
                });
            }
        });

        it('should redirect to login when user is not authenticated', (done) => {
            // 設置未認證狀態
            authStateManager.isAuthenticated.and.returnValue(false);
            authStateManager.getCurrentState.and.returnValue({
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
                error: null
            });

            // 執行守衛檢查
            const result = guard.canActivate(mockRoute, mockState);

            if (typeof result === 'boolean') {
                expect(result).toBe(false);
                expect(router.navigateByUrl).toHaveBeenCalledWith('/passport/login');
                done();
            } else {
                result.subscribe(canActivate => {
                    expect(canActivate).toBe(false);
                    expect(router.navigateByUrl).toHaveBeenCalledWith('/passport/login');
                    done();
                });
            }
        });

        it('should handle loading state appropriately', (done) => {
            // 設置載入狀態
            authStateManager.isAuthenticated.and.returnValue(false);
            authStateManager.getCurrentState.and.returnValue({
                isAuthenticated: false,
                user: null,
                token: null,
                loading: true,
                error: null
            });

            // 執行守衛檢查
            const result = guard.canActivate(mockRoute, mockState);

            if (typeof result === 'boolean') {
                // 載入狀態下應該拒絕存取
                expect(result).toBe(false);
                done();
            } else {
                result.subscribe(canActivate => {
                    expect(canActivate).toBe(false);
                    done();
                });
            }
        });
    });

    describe('HTTP Interceptor Integration', () => {
        it('should attach Firebase token to HTTP requests', () => {
            // 設置有效 token
            tokenService.get.and.returnValue(mockAlainToken);

            // 發送 HTTP 請求
            httpClient.get('/api/test').subscribe();

            // 驗證請求
            const req = httpMock.expectOne('/api/test');
            expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);

            req.flush({ success: true });
        });

        it('should not attach token when user is not authenticated', () => {
            // 設置無 token 狀態
            tokenService.get.and.returnValue(null);

            // 發送 HTTP 請求
            httpClient.get('/api/test').subscribe();

            // 驗證請求沒有 Authorization header
            const req = httpMock.expectOne('/api/test');
            expect(req.request.headers.has('Authorization')).toBe(false);

            req.flush({ success: true });
        });

        it('should handle token refresh on 401 response', () => {
            // 設置過期 token
            const expiredToken = {
                ...mockAlainToken,
                expired: Date.now() - 1000 // 已過期
            };
            tokenService.get.and.returnValue(expiredToken);

            // 模擬 token 刷新
            firebaseAuth.getIdToken.and.returnValue(of('new-refreshed-token'));
            authStateManager.handleTokenRefresh.and.returnValue(of(void 0));

            // 發送 HTTP 請求
            httpClient.get('/api/test').subscribe();

            // 第一個請求應該失敗並觸發 token 刷新
            const req1 = httpMock.expectOne('/api/test');
            req1.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

            // 驗證 token 刷新被調用
            expect(firebaseAuth.getIdToken).toHaveBeenCalledWith(true);
        });

        it('should handle multiple concurrent requests during token refresh', () => {
            // 設置過期 token
            const expiredToken = {
                ...mockAlainToken,
                expired: Date.now() - 1000
            };
            tokenService.get.and.returnValue(expiredToken);

            // 模擬 token 刷新
            firebaseAuth.getIdToken.and.returnValue(of('new-refreshed-token'));
            authStateManager.handleTokenRefresh.and.returnValue(of(void 0));

            // 發送多個並發請求
            httpClient.get('/api/test1').subscribe();
            httpClient.get('/api/test2').subscribe();
            httpClient.get('/api/test3').subscribe();

            // 驗證所有請求都被發送
            const req1 = httpMock.expectOne('/api/test1');
            const req2 = httpMock.expectOne('/api/test2');
            const req3 = httpMock.expectOne('/api/test3');

            // 模擬所有請求都返回 401
            req1.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
            req2.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
            req3.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

            // 驗證 token 刷新只被調用一次（去重）
            expect(firebaseAuth.getIdToken).toHaveBeenCalledTimes(1);
        });

        it('should handle token refresh failure', () => {
            // 設置過期 token
            const expiredToken = {
                ...mockAlainToken,
                expired: Date.now() - 1000
            };
            tokenService.get.and.returnValue(expiredToken);

            // 模擬 token 刷新失敗
            const refreshError = new Error('Token refresh failed');
            firebaseAuth.getIdToken.and.returnValue(throwError(() => refreshError));

            // 發送 HTTP 請求
            httpClient.get('/api/test').subscribe({
                error: (error) => {
                    expect(error.status).toBe(401);
                }
            });

            // 驗證請求
            const req = httpMock.expectOne('/api/test');
            req.flush({ error: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

            // 驗證錯誤處理被調用
            expect(errorHandler.handleTokenRefreshError).toHaveBeenCalledWith(refreshError);
        });
    });

    describe('Guard and Interceptor Coordination', () => {
        it('should coordinate authentication state between guard and interceptor', (done) => {
            // 設置認證狀態
            authStateManager.isAuthenticated.and.returnValue(true);
            authStateManager.getCurrentState.and.returnValue({
                isAuthenticated: true,
                user: mockUser,
                token: mockToken,
                loading: false,
                error: null
            });
            tokenService.get.and.returnValue(mockAlainToken);

            // 1. 首先測試守衛允許存取
            const mockRoute = {} as ActivatedRouteSnapshot;
            const mockState = { url: '/protected-route' } as RouterStateSnapshot;

            const guardResult = guard.canActivate(mockRoute, mockState);

            const checkGuardResult = (canActivate: boolean) => {
                expect(canActivate).toBe(true);

                // 2. 然後測試攔截器附加 token
                httpClient.get('/api/protected-data').subscribe(response => {
                    expect(response).toEqual({ data: 'protected' });
                    done();
                });

                const req = httpMock.expectOne('/api/protected-data');
                expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
                req.flush({ data: 'protected' });
            };

            if (typeof guardResult === 'boolean') {
                checkGuardResult(guardResult);
            } else {
                guardResult.subscribe(checkGuardResult);
            }
        });

        it('should handle authentication failure in both guard and interceptor', (done) => {
            // 設置未認證狀態
            authStateManager.isAuthenticated.and.returnValue(false);
            authStateManager.getCurrentState.and.returnValue({
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
                error: null
            });
            tokenService.get.and.returnValue(null);

            // 1. 測試守衛拒絕存取
            const mockRoute = {} as ActivatedRouteSnapshot;
            const mockState = { url: '/protected-route' } as RouterStateSnapshot;

            const guardResult = guard.canActivate(mockRoute, mockState);

            const checkGuardResult = (canActivate: boolean) => {
                expect(canActivate).toBe(false);
                expect(router.navigateByUrl).toHaveBeenCalledWith('/passport/login');

                // 2. 測試攔截器不附加 token
                httpClient.get('/api/public-data').subscribe(response => {
                    expect(response).toEqual({ data: 'public' });
                    done();
                });

                const req = httpMock.expectOne('/api/public-data');
                expect(req.request.headers.has('Authorization')).toBe(false);
                req.flush({ data: 'public' });
            };

            if (typeof guardResult === 'boolean') {
                checkGuardResult(guardResult);
            } else {
                guardResult.subscribe(checkGuardResult);
            }
        });
    });

    describe('Error Handling Integration', () => {
        it('should handle authentication errors consistently across guard and interceptor', () => {
            // 設置錯誤狀態
            const authError = 'Authentication failed';
            authStateManager.getCurrentState.and.returnValue({
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
                error: authError
            });

            // 測試守衛處理錯誤
            const mockRoute = {} as ActivatedRouteSnapshot;
            const mockState = { url: '/protected-route' } as RouterStateSnapshot;

            const guardResult = guard.canActivate(mockRoute, mockState);

            if (typeof guardResult === 'boolean') {
                expect(guardResult).toBe(false);
            } else {
                guardResult.subscribe(canActivate => {
                    expect(canActivate).toBe(false);
                });
            }

            // 測試攔截器處理錯誤
            tokenService.get.and.returnValue(null);

            httpClient.get('/api/test').subscribe();

            const req = httpMock.expectOne('/api/test');
            expect(req.request.headers.has('Authorization')).toBe(false);
            req.flush({ success: true });
        });

        it('should handle network errors in interceptor', () => {
            // 設置有效 token
            tokenService.get.and.returnValue(mockAlainToken);

            // 發送請求並模擬網路錯誤
            httpClient.get('/api/test').subscribe({
                error: (error) => {
                    expect(error.status).toBe(0);
                }
            });

            const req = httpMock.expectOne('/api/test');
            req.error(new ProgressEvent('Network error'));
        });
    });

    describe('Performance Integration', () => {
        it('should efficiently handle multiple route checks', () => {
            // 設置認證狀態
            authStateManager.isAuthenticated.and.returnValue(true);
            authStateManager.getCurrentState.and.returnValue({
                isAuthenticated: true,
                user: mockUser,
                token: mockToken,
                loading: false,
                error: null
            });

            const mockRoute = {} as ActivatedRouteSnapshot;
            const routes = [
                { url: '/route1' },
                { url: '/route2' },
                { url: '/route3' }
            ] as RouterStateSnapshot[];

            // 執行多個路由檢查
            routes.forEach(state => {
                const result = guard.canActivate(mockRoute, state);
                if (typeof result === 'boolean') {
                    expect(result).toBe(true);
                } else {
                    result.subscribe(canActivate => {
                        expect(canActivate).toBe(true);
                    });
                }
            });

            // 驗證狀態檢查被正確調用
            expect(authStateManager.isAuthenticated).toHaveBeenCalledTimes(routes.length);
        });

        it('should efficiently handle multiple HTTP requests', () => {
            // 設置有效 token
            tokenService.get.and.returnValue(mockAlainToken);

            // 發送多個 HTTP 請求
            const requests = ['/api/test1', '/api/test2', '/api/test3'];

            requests.forEach(url => {
                httpClient.get(url).subscribe();
            });

            // 驗證所有請求都有正確的 Authorization header
            requests.forEach(url => {
                const req = httpMock.expectOne(url);
                expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
                req.flush({ success: true });
            });

            // 驗證 token 服務只被調用了必要的次數
            expect(tokenService.get).toHaveBeenCalledTimes(requests.length);
        });
    });
});