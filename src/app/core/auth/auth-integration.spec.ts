import { TestBed } from '@angular/core/testing';
import { of, switchMap } from 'rxjs';
import { appConfig } from '../../app.config';
import { StartupService } from '../startup/startup.service';
import { AuthStateManagerService, SessionManagerService, FirebaseAuthAdapterService } from './';

/**
 * Firebase Auth 整合測試
 * 
 * 測試應用程式配置和服務初始化順序
 */
describe('Firebase Auth Integration', () => {
  let startupService: StartupService;
  let authStateManager: AuthStateManagerService;
  let sessionManager: SessionManagerService;
  let firebaseAuth: FirebaseAuthAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule(appConfig);

    startupService = TestBed.inject(StartupService);
    authStateManager = TestBed.inject(AuthStateManagerService);
    sessionManager = TestBed.inject(SessionManagerService);
    firebaseAuth = TestBed.inject(FirebaseAuthAdapterService);

    // 清除 localStorage
    localStorage.clear();

    // 模擬 navigator 物件
    spyOnProperty(navigator, 'userAgent', 'get').and.returnValue('test-user-agent');
    spyOnProperty(navigator, 'platform', 'get').and.returnValue('test-platform');
    spyOnProperty(navigator, 'language', 'get').and.returnValue('en-US');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create all Firebase Auth integration services', () => {
    expect(startupService).toBeTruthy();
    expect(authStateManager).toBeTruthy();
    expect(sessionManager).toBeTruthy();
    expect(firebaseAuth).toBeTruthy();
  });

  it('should have services as singletons', () => {
    const authStateManager2 = TestBed.inject(AuthStateManagerService);
    const sessionManager2 = TestBed.inject(SessionManagerService);
    const firebaseAuth2 = TestBed.inject(FirebaseAuthAdapterService);

    expect(authStateManager).toBe(authStateManager2);
    expect(sessionManager).toBe(sessionManager2);
    expect(firebaseAuth).toBe(firebaseAuth2);
  });

  it('should have session manager available in startup service', () => {
    // 驗證 startup service 可以存取 session manager
    expect(startupService['sessionManager']).toBeTruthy();
    expect(startupService['authStateManager']).toBeTruthy();
  });

  it('should have proper service injection', () => {
    // 驗證服務注入是否正確
    expect(sessionManager).toBeInstanceOf(SessionManagerService);
    expect(authStateManager).toBeInstanceOf(AuthStateManagerService);
    expect(firebaseAuth).toBeInstanceOf(FirebaseAuthAdapterService);
  });

  it('should have proper service dependencies', () => {
    // 驗證服務依賴關係是否正確設置
    expect(authStateManager['firebaseAuth']).toBeTruthy();
    expect(authStateManager['tokenSync']).toBeTruthy();
    expect(authStateManager['sessionManager']).toBeTruthy();
    expect(authStateManager['errorHandler']).toBeTruthy();
  });
});