import { TestBed } from '@angular/core/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';
import { TokenSyncService } from './token-sync.service';

describe('Auth Integration', () => {
  let authAdapter: FirebaseAuthAdapterService;
  let tokenSync: TokenSyncService;
  let mockTokenService: jasmine.SpyObj<any>;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;

  beforeEach(() => {
    const tokenSpy = jasmine.createSpyObj('TokenService', ['set', 'clear', 'get']);
    const settingsSpy = jasmine.createSpyObj('SettingsService', ['setUser']);

    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp({
          projectId: 'test-project',
          apiKey: 'test-api-key',
          authDomain: 'test-project.firebaseapp.com'
        })),
        provideAuth(() => {
          const auth = getAuth();
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
          return auth;
        }),
        { provide: DA_SERVICE_TOKEN, useValue: tokenSpy },
        { provide: SettingsService, useValue: settingsSpy }
      ]
    });
    
    authAdapter = TestBed.inject(FirebaseAuthAdapterService);
    tokenSync = TestBed.inject(TokenSyncService);
    mockTokenService = TestBed.inject(DA_SERVICE_TOKEN) as jasmine.SpyObj<any>;
    mockSettingsService = TestBed.inject(SettingsService) as jasmine.SpyObj<SettingsService>;
  });

  it('should create both services', () => {
    expect(authAdapter).toBeTruthy();
    expect(tokenSync).toBeTruthy();
  });

  it('should work together for token synchronization', (done) => {
    const mockUser = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      photoURL: 'https://example.com/avatar.jpg'
    } as any;

    const mockToken = 'mock-firebase-token';

    // 模擬 token 同步流程
    tokenSync.syncFirebaseToken(mockToken, mockUser).subscribe(() => {
      // 驗證 token 服務被正確呼叫
      expect(mockTokenService.set).toHaveBeenCalledWith(jasmine.objectContaining({
        token: mockToken,
        uid: mockUser.uid,
        email: mockUser.email
      }));

      // 驗證設定服務被正確呼叫
      expect(mockSettingsService.setUser).toHaveBeenCalledWith({
        name: mockUser.displayName,
        avatar: mockUser.photoURL,
        email: mockUser.email,
        token: mockToken
      });

      done();
    });
  });

  it('should handle token format conversion correctly', () => {
    const mockUser = {
      uid: 'test-uid-123',
      email: 'user@test.com',
      displayName: 'Test User Name',
      photoURL: null
    } as any;

    const firebaseToken = 'firebase-id-token-example';
    const alainToken = tokenSync.convertToAlainFormat(firebaseToken, mockUser);

    expect(alainToken).toEqual(jasmine.objectContaining({
      token: firebaseToken,
      uid: mockUser.uid,
      email: mockUser.email,
      name: mockUser.displayName,
      avatar: undefined,
      expired: jasmine.any(Number)
    }));

    // 驗證過期時間設定合理（應該是未來的時間）
    expect(alainToken.expired).toBeGreaterThan(Date.now());
    expect(alainToken.expired).toBeLessThan(Date.now() + (2 * 60 * 60 * 1000)); // 不超過 2 小時
  });
});