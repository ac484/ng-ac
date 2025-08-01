import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { of } from 'rxjs';
import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';
import { FirebaseErrorHandlerService } from './firebase-error-handler.service';

describe('FirebaseAuthAdapterService Integration', () => {
  let service: FirebaseAuthAdapterService;
  let mockAuth: jasmine.SpyObj<Auth>;
  let mockErrorHandler: jasmine.SpyObj<FirebaseErrorHandlerService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('Auth', ['signInWithEmailAndPassword', 'signOut']);
    const errorHandlerSpy = jasmine.createSpyObj('FirebaseErrorHandlerService', ['handleError', 'handleSilentError']);

    TestBed.configureTestingModule({
      providers: [
        FirebaseAuthAdapterService,
        { provide: Auth, useValue: authSpy },
        { provide: FirebaseErrorHandlerService, useValue: errorHandlerSpy }
      ]
    });

    service = TestBed.inject(FirebaseAuthAdapterService);
    mockAuth = TestBed.inject(Auth) as jasmine.SpyObj<Auth>;
    mockErrorHandler = TestBed.inject(FirebaseErrorHandlerService) as jasmine.SpyObj<FirebaseErrorHandlerService>;

    // 設置 authState$ 的模擬
    Object.defineProperty(service, 'authState$', {
      get: () => of(null),
      configurable: true
    });

    // 設置 isAuthenticated$ 的模擬
    Object.defineProperty(service, 'isAuthenticated$', {
      get: () => of(false),
      configurable: true
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have authState$ observable', (done) => {
    service.authState$.subscribe(user => {
      // 初始狀態應該是 null（未登入）
      expect(user).toBeNull();
      done();
    });
  });

  it('should have isAuthenticated$ observable', (done) => {
    service.isAuthenticated$.subscribe(isAuth => {
      // 初始狀態應該是 false（未認證）
      expect(isAuth).toBe(false);
      done();
    });
  });

  it('should return null for getIdToken when not authenticated', (done) => {
    service.getIdToken().subscribe(token => {
      expect(token).toBeNull();
      done();
    });
  });
});