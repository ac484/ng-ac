import { TestBed } from '@angular/core/testing';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { TokenSyncService, AlainFirebaseToken } from './token-sync.service';

describe('TokenSyncService', () => {
  let service: TokenSyncService;
  let mockTokenService: jasmine.SpyObj<any>;
  let mockSettingsService: jasmine.SpyObj<SettingsService>;

  const mockFirebaseUser = {
    uid: 'test-uid',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/avatar.jpg'
  } as any;

  beforeEach(() => {
    const tokenSpy = jasmine.createSpyObj('TokenService', ['set', 'clear', 'get']);
    const settingsSpy = jasmine.createSpyObj('SettingsService', ['setUser']);

    TestBed.configureTestingModule({
      providers: [
        { provide: DA_SERVICE_TOKEN, useValue: tokenSpy },
        { provide: SettingsService, useValue: settingsSpy }
      ]
    });
    
    service = TestBed.inject(TokenSyncService);
    mockTokenService = TestBed.inject(DA_SERVICE_TOKEN) as jasmine.SpyObj<any>;
    mockSettingsService = TestBed.inject(SettingsService) as jasmine.SpyObj<SettingsService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('convertToAlainFormat', () => {
    it('should convert Firebase token to Alain format', () => {
      const firebaseToken = 'firebase-id-token';
      const result = service.convertToAlainFormat(firebaseToken, mockFirebaseUser);

      expect(result.token).toBe(firebaseToken);
      expect(result.uid).toBe(mockFirebaseUser.uid);
      expect(result.email).toBe(mockFirebaseUser.email);
      expect(result.name).toBe(mockFirebaseUser.displayName);
      expect(result.avatar).toBe(mockFirebaseUser.photoURL);
      expect(result.expired).toBeGreaterThan(Date.now());
    });

    it('should handle user without display name', () => {
      const userWithoutName = { ...mockFirebaseUser, displayName: null };
      const result = service.convertToAlainFormat('token', userWithoutName);

      expect(result.name).toBe(mockFirebaseUser.email);
    });

    it('should handle user without email and display name', () => {
      const userMinimal = { uid: 'test-uid' } as any;
      const result = service.convertToAlainFormat('token', userMinimal);

      expect(result.name).toBe('User');
      expect(result.email).toBeUndefined();
    });
  });

  describe('syncFirebaseToken', () => {
    it('should sync Firebase token to Alain services', (done) => {
      const firebaseToken = 'firebase-id-token';

      service.syncFirebaseToken(firebaseToken, mockFirebaseUser).subscribe(() => {
        expect(mockTokenService.set).toHaveBeenCalledWith(jasmine.objectContaining({
          token: firebaseToken,
          uid: mockFirebaseUser.uid,
          email: mockFirebaseUser.email
        }));

        expect(mockSettingsService.setUser).toHaveBeenCalledWith({
          name: mockFirebaseUser.displayName,
          avatar: mockFirebaseUser.photoURL,
          email: mockFirebaseUser.email,
          token: firebaseToken
        });

        done();
      });
    });
  });

  describe('clearTokens', () => {
    it('should clear all tokens and user data', (done) => {
      service.clearTokens().subscribe(() => {
        expect(mockTokenService.clear).toHaveBeenCalled();
        expect(mockSettingsService.setUser).toHaveBeenCalledWith({});
        done();
      });
    });
  });

  describe('monitorTokenExpiration', () => {
    it('should return true when no token exists', (done) => {
      mockTokenService.get.and.returnValue(null);

      service.monitorTokenExpiration().subscribe(isExpiring => {
        expect(isExpiring).toBe(true);
        done();
      });
    });

    it('should return true when token is expiring soon', (done) => {
      const soonExpiredToken = {
        expired: Date.now() + (2 * 60 * 1000) // 2 分鐘後過期
      };
      mockTokenService.get.and.returnValue(soonExpiredToken);

      service.monitorTokenExpiration().subscribe(isExpiring => {
        expect(isExpiring).toBe(true);
        done();
      });
    });

    it('should return false when token has plenty of time', (done) => {
      const validToken = {
        expired: Date.now() + (30 * 60 * 1000) // 30 分鐘後過期
      };
      mockTokenService.get.and.returnValue(validToken);

      service.monitorTokenExpiration().subscribe(isExpiring => {
        expect(isExpiring).toBe(false);
        done();
      });
    });
  });

  describe('getCurrentToken', () => {
    it('should return current token from token service', () => {
      const mockToken: AlainFirebaseToken = {
        token: 'test-token',
        expired: Date.now() + 3600000,
        uid: 'test-uid'
      };
      mockTokenService.get.and.returnValue(mockToken);

      const result = service.getCurrentToken();
      expect(result).toBe(mockToken);
    });
  });
});