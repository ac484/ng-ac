import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpContext } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { of } from 'rxjs';

import { firebaseAuthGuard } from './firebase-auth.guard';
import { firebaseTokenInterceptor } from './firebase-token.interceptor';
import { AuthStateManagerService } from './auth-state-manager.service';
import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';
import { ALLOW_ANONYMOUS } from '@delon/auth';

describe('Firebase Auth Integration', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let mockAuthStateManager: jasmine.SpyObj<AuthStateManagerService>;
  let mockFirebaseAuth: jasmine.SpyObj<FirebaseAuthAdapterService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockAuthenticatedState = {
    isAuthenticated: true,
    user: { uid: 'test-uid', email: 'test@example.com' },
    token: 'mock-firebase-token',
    loading: false,
    error: null
  };

  const mockUnauthenticatedState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  };

  beforeEach(() => {
    const authStateManagerSpy = jasmine.createSpyObj('AuthStateManagerService',
      ['getCurrentState', 'handleTokenRefresh', 'clearSession'],
      { authState$: of(mockAuthenticatedState) }
    );
    const firebaseAuthSpy = jasmine.createSpyObj('FirebaseAuthAdapterService', ['getIdToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([firebaseTokenInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthStateManagerService, useValue: authStateManagerSpy },
        { provide: FirebaseAuthAdapterService, useValue: firebaseAuthSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    mockAuthStateManager = TestBed.inject(AuthStateManagerService) as jasmine.SpyObj<AuthStateManagerService>;
    mockFirebaseAuth = TestBed.inject(FirebaseAuthAdapterService) as jasmine.SpyObj<FirebaseAuthAdapterService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // 設定預設的 mock 回傳值
    mockAuthStateManager.getCurrentState.and.returnValue(mockAuthenticatedState);
    mockAuthStateManager.handleTokenRefresh.and.returnValue(of(void 0));
    mockAuthStateManager.clearSession.and.returnValue(of(void 0));
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('Guard and Interceptor Integration', () => {
    it('should allow authenticated requests with Firebase token', (done) => {
      const mockRoute = {} as ActivatedRouteSnapshot;
      const mockState = { url: '/dashboard' } as RouterStateSnapshot;

      // 測試 guard 允許認證用戶訪問
      TestBed.runInInjectionContext(() => {
        const guardResult = firebaseAuthGuard(mockRoute, mockState);
        if (typeof guardResult === 'object' && 'subscribe' in guardResult) {
          guardResult.subscribe(canActivate => {
            expect(canActivate).toBe(true);
            expect(mockRouter.navigate).not.toHaveBeenCalled();

            // 測試 interceptor 添加 token 到請求
            httpClient.get('/api/test').subscribe(response => {
              expect(response).toBeTruthy();
              done();
            });

            const req = httpTestingController.expectOne('/api/test');
            expect(req.request.headers.get('Authorization')).toBe('Bearer mock-firebase-token');
            req.flush({ success: true });
          });
        }
      });
    });

    it('should redirect unauthenticated users and not add token', (done) => {
      Object.defineProperty(mockAuthStateManager, 'authState$', {
        value: of(mockUnauthenticatedState)
      });
      mockAuthStateManager.getCurrentState.and.returnValue(mockUnauthenticatedState);

      const mockRoute = {} as ActivatedRouteSnapshot;
      const mockState = { url: '/dashboard' } as RouterStateSnapshot;

      // 測試 guard 重定向未認證用戶
      TestBed.runInInjectionContext(() => {
        const guardResult = firebaseAuthGuard(mockRoute, mockState);
        if (typeof guardResult === 'object' && 'subscribe' in guardResult) {
          guardResult.subscribe(canActivate => {
            expect(canActivate).toBe(false);
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/passport/login']);

            // 測試 interceptor 不添加 token 到未認證請求
            httpClient.get('/api/test').subscribe(response => {
              expect(response).toBeTruthy();
              done();
            });

            const req = httpTestingController.expectOne('/api/test');
            expect(req.request.headers.has('Authorization')).toBe(false);
            req.flush({ success: true });
          });
        }
      });
    });

    it('should skip token for anonymous requests', (done) => {
      // 測試 ALLOW_ANONYMOUS 請求不添加 token
      const context = new HttpContext().set(ALLOW_ANONYMOUS, true);

      httpClient.get('/api/public', { context }).subscribe(response => {
        expect(response).toBeTruthy();
        done();
      });

      const req = httpTestingController.expectOne('/api/public');
      expect(req.request.headers.has('Authorization')).toBe(false);
      req.flush({ success: true });
    });
  });
});