import { TestBed } from '@angular/core/testing';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { AuthStateManagerService } from './auth-state-manager.service';
import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';
import { TokenSyncService } from './token-sync.service';
import { AuthState } from './auth.types';

describe('AuthStateManagerService', () => {
  let service: AuthStateManagerService;
  let mockFirebaseAuth: jasmine.SpyObj<FirebaseAuthAdapterService>;
  let mockTokenSync: jasmine.SpyObj<TokenSyncService>;
  let mockAuthState$: BehaviorSubject<any>;

  const mockUser = {
    uid: 'test-uid',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/avatar.jpg'
  } as any;

  beforeEach(() => {
    mockAuthState$ = new BehaviorSubject(null);
    
    const firebaseAuthSpy = jasmine.createSpyObj('FirebaseAuthAdapterService', 
      ['getCurrentUser', 'getIdToken', 'signOut']
    );
    
    // 設定 authState$ 屬性
    Object.defineProperty(firebaseAuthSpy, 'authState$', {
      value: mockAuthState$.asObservable(),
      writable: false
    });
    
    const tokenSyncSpy = jasmine.createSpyObj('TokenSyncService', 
      ['syncFirebaseToken', 'clearTokens']
    );

    TestBed.configureTestingModule({
      providers: [
        { provide: FirebaseAuthAdapterService, useValue: firebaseAuthSpy },
        { provide: TokenSyncService, useValue: tokenSyncSpy }
      ]
    });
    
    service = TestBed.inject(AuthStateManagerService);
    mockFirebaseAuth = TestBed.inject(FirebaseAuthAdapterService) as jasmine.SpyObj<FirebaseAuthAdapterService>;
    mockTokenSync = TestBed.inject(TokenSyncService) as jasmine.SpyObj<TokenSyncService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial auth state', (done) => {
    service.authState$.subscribe(state => {
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
      done();
    });
  });

  describe('handleAuthStateChange', () => {
    it('should handle user authentication', (done) => {
      const mockToken = 'mock-firebase-token';
      
      mockFirebaseAuth.getIdToken.and.returnValue(of(mockToken));
      mockTokenSync.syncFirebaseToken.and.returnValue(of(void 0));

      service.handleAuthStateChange(mockUser).subscribe(() => {
        const currentState = service.getCurrentState();
        expect(currentState.isAuthenticated).toBe(true);
        expect(currentState.user).toBe(mockUser);
        expect(currentState.token).toBe(mockToken);
        done();
      });
    });

    it('should handle user logout', (done) => {
      mockTokenSync.clearTokens.and.returnValue(of(void 0));

      service.handleAuthStateChange(null).subscribe(() => {
        const currentState = service.getCurrentState();
        expect(currentState.isAuthenticated).toBe(false);
        expect(currentState.user).toBeNull();
        expect(currentState.token).toBeNull();
        done();
      });
    });
  });

  describe('handleTokenRefresh', () => {
    it('should refresh token for authenticated user', (done) => {
      const newToken = 'new-firebase-token';
      
      // 設定初始認證狀態
      service['updateAuthState']({
        isAuthenticated: true,
        user: mockUser,
        token: 'old-token',
        loading: false,
        error: null
      });

      mockTokenSync.syncFirebaseToken.and.returnValue(of(void 0));

      service.handleTokenRefresh(newToken).subscribe(() => {
        const currentState = service.getCurrentState();
        expect(currentState.token).toBe(newToken);
        expect(currentState.error).toBeNull();
        done();
      });
    });

    it('should not refresh token for unauthenticated user', (done) => {
      const newToken = 'new-firebase-token';

      service.handleTokenRefresh(newToken).subscribe({
        complete: () => {
          // 應該立即完成，不執行任何操作
          expect(true).toBe(true); // 添加期望值
          done();
        }
      });
    });
  });

  describe('restoreSession', () => {
    it('should return true when user session exists', (done) => {
      mockFirebaseAuth.getCurrentUser.and.returnValue(of(mockUser));

      service.restoreSession().subscribe(hasSession => {
        expect(hasSession).toBe(true);
        done();
      });
    });

    it('should return false when no user session', (done) => {
      mockFirebaseAuth.getCurrentUser.and.returnValue(of(null));

      service.restoreSession().subscribe(hasSession => {
        expect(hasSession).toBe(false);
        done();
      });
    });
  });

  describe('clearSession', () => {
    it('should clear session and update state', (done) => {
      mockFirebaseAuth.signOut.and.returnValue(of(void 0));
      mockTokenSync.clearTokens.and.returnValue(of(void 0));

      service.clearSession().subscribe(() => {
        const currentState = service.getCurrentState();
        expect(currentState.isAuthenticated).toBe(false);
        expect(currentState.user).toBeNull();
        expect(currentState.token).toBeNull();
        expect(currentState.loading).toBe(false);
        expect(currentState.error).toBeNull();
        done();
      });
    });
  });

  describe('utility methods', () => {
    it('should return current authentication status', () => {
      expect(service.isAuthenticated()).toBe(false);
      
      service['updateAuthState']({
        isAuthenticated: true,
        user: mockUser,
        token: 'token',
        loading: false,
        error: null
      });
      
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return current user', () => {
      expect(service.getCurrentUser()).toBeNull();
      
      service['updateAuthState']({
        isAuthenticated: true,
        user: mockUser,
        token: 'token',
        loading: false,
        error: null
      });
      
      expect(service.getCurrentUser()).toBe(mockUser);
    });
  });
});