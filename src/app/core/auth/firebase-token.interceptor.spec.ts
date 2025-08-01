import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpErrorResponse, HttpContext, HttpResponse } from '@angular/common/http';
import { ALLOW_ANONYMOUS } from '@delon/auth';
import { of, throwError } from 'rxjs';
import { firebaseTokenInterceptor } from './firebase-token.interceptor';
import { AuthStateManagerService } from './auth-state-manager.service';
import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';

describe('firebaseTokenInterceptor', () => {
  let mockAuthStateManager: jasmine.SpyObj<AuthStateManagerService>;
  let mockFirebaseAuth: jasmine.SpyObj<FirebaseAuthAdapterService>;
  let mockNext: jasmine.SpyObj<HttpHandler>;

  const mockAuthState = {
    isAuthenticated: true,
    user: { uid: 'test-uid', email: 'test@example.com' },
    token: 'mock-firebase-token',
    loading: false,
    error: null
  };

  beforeEach(() => {
    const authStateManagerSpy = jasmine.createSpyObj('AuthStateManagerService', 
      ['getCurrentState', 'handleTokenRefresh', 'clearSession']
    );
    const firebaseAuthSpy = jasmine.createSpyObj('FirebaseAuthAdapterService', 
      ['getIdToken']
    );
    const nextSpy = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStateManagerService, useValue: authStateManagerSpy },
        { provide: FirebaseAuthAdapterService, useValue: firebaseAuthSpy }
      ]
    });

    mockAuthStateManager = TestBed.inject(AuthStateManagerService) as jasmine.SpyObj<AuthStateManagerService>;
    mockFirebaseAuth = TestBed.inject(FirebaseAuthAdapterService) as jasmine.SpyObj<FirebaseAuthAdapterService>;
    mockNext = nextSpy;

    // 設定預設的 mock 回傳值
    mockAuthStateManager.getCurrentState.and.returnValue(mockAuthState);
    mockAuthStateManager.clearSession.and.returnValue(of(void 0));
    mockNext.handle.and.returnValue(of(new HttpResponse({ status: 200, body: 'success' })));
  });

  it('should pass through requests with ALLOW_ANONYMOUS context', () => {
    const req = new HttpRequest('GET', '/api/test', null, {
      context: new HttpContext().set(ALLOW_ANONYMOUS, true)
    });

    TestBed.runInInjectionContext(() => {
      firebaseTokenInterceptor(req, mockNext.handle).subscribe();
    });

    expect(mockNext.handle).toHaveBeenCalledWith(req);
    expect(mockAuthStateManager.getCurrentState).not.toHaveBeenCalled();
  });

  it('should pass through Firebase-related requests', () => {
    const req = new HttpRequest('GET', 'https://firebase.googleapis.com/test');

    TestBed.runInInjectionContext(() => {
      firebaseTokenInterceptor(req, mockNext.handle).subscribe();
    });

    expect(mockNext.handle).toHaveBeenCalledWith(req);
  });

  it('should pass through requests when user is not authenticated', () => {
    const unauthenticatedState = { ...mockAuthState, isAuthenticated: false, token: null };
    mockAuthStateManager.getCurrentState.and.returnValue(unauthenticatedState);

    const req = new HttpRequest('GET', '/api/test');

    TestBed.runInInjectionContext(() => {
      firebaseTokenInterceptor(req, mockNext.handle).subscribe();
    });

    expect(mockNext.handle).toHaveBeenCalledWith(req);
  });

  it('should add Authorization header for authenticated requests', () => {
    const req = new HttpRequest('GET', '/api/test');

    TestBed.runInInjectionContext(() => {
      firebaseTokenInterceptor(req, mockNext.handle).subscribe();
    });

    const capturedRequest = mockNext.handle.calls.mostRecent().args[0];
    expect(capturedRequest.headers.get('Authorization')).toBe('Bearer mock-firebase-token');
  });

  it('should handle 401 error and refresh token', (done) => {
    const req = new HttpRequest('GET', '/api/test');
    const error401 = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    const newToken = 'new-firebase-token';

    // 第一次請求返回 401 錯誤
    mockNext.handle.and.returnValues(
      throwError(() => error401),
      of(new HttpResponse({ status: 200, body: 'success' })) // 重試請求成功
    );

    mockFirebaseAuth.getIdToken.and.returnValue(of(newToken));
    mockAuthStateManager.handleTokenRefresh.and.returnValue(of(void 0));

    TestBed.runInInjectionContext(() => {
      firebaseTokenInterceptor(req, mockNext.handle).subscribe({
        next: (response) => {
          expect((response as HttpResponse<any>).status).toBe(200);
          expect(mockFirebaseAuth.getIdToken).toHaveBeenCalledWith(true);
          expect(mockAuthStateManager.handleTokenRefresh).toHaveBeenCalledWith(newToken);
          
          // 檢查重試請求是否包含新的 token
          const retryRequest = mockNext.handle.calls.mostRecent().args[0];
          expect(retryRequest.headers.get('Authorization')).toBe('Bearer new-firebase-token');
          done();
        },
        error: done.fail
      });
    });
  });

  it('should clear session when token refresh fails', (done) => {
    const req = new HttpRequest('GET', '/api/test');
    const error401 = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });

    mockNext.handle.and.returnValue(throwError(() => error401));
    mockFirebaseAuth.getIdToken.and.returnValue(of(null)); // Token 刷新失敗
    mockAuthStateManager.clearSession.and.returnValue(of(void 0));

    TestBed.runInInjectionContext(() => {
      firebaseTokenInterceptor(req, mockNext.handle).subscribe({
        next: () => done.fail('Should not succeed'),
        error: (error) => {
          expect(mockAuthStateManager.clearSession).toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should handle non-401 errors normally', (done) => {
    const req = new HttpRequest('GET', '/api/test');
    const error500 = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });

    mockNext.handle.and.returnValue(throwError(() => error500));

    TestBed.runInInjectionContext(() => {
      firebaseTokenInterceptor(req, mockNext.handle).subscribe({
        next: () => done.fail('Should not succeed'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(mockFirebaseAuth.getIdToken).not.toHaveBeenCalled();
          done();
        }
      });
    });
  });

  it('should handle token refresh correctly', (done) => {
    const req = new HttpRequest('GET', '/api/test');
    const error401 = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    const newToken = 'new-firebase-token';

    // 第一次請求返回 401，第二次成功
    mockNext.handle.and.returnValues(
      throwError(() => error401),
      of(new HttpResponse({ status: 200, body: 'success' }))
    );

    mockFirebaseAuth.getIdToken.and.returnValue(of(newToken));
    mockAuthStateManager.handleTokenRefresh.and.returnValue(of(void 0));

    TestBed.runInInjectionContext(() => {
      firebaseTokenInterceptor(req, mockNext.handle).subscribe({
        next: (response) => {
          expect((response as HttpResponse<any>).status).toBe(200);
          expect(mockFirebaseAuth.getIdToken).toHaveBeenCalledWith(true);
          expect(mockAuthStateManager.handleTokenRefresh).toHaveBeenCalledWith(newToken);
          done();
        },
        error: done.fail
      });
    });
  });
});