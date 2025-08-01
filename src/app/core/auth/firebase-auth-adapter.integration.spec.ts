import { TestBed } from '@angular/core/testing';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';

describe('FirebaseAuthAdapterService Integration', () => {
  let service: FirebaseAuthAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp({
          projectId: 'test-project',
          apiKey: 'test-api-key',
          authDomain: 'test-project.firebaseapp.com'
        })),
        provideAuth(() => {
          const auth = getAuth();
          // 連接到 Firebase Auth Emulator 進行測試
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
          return auth;
        })
      ]
    });
    
    service = TestBed.inject(FirebaseAuthAdapterService);
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