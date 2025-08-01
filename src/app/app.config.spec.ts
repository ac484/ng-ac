import { TestBed } from '@angular/core/testing';
import { appConfig } from './app.config';
import { FirebaseAuthAdapterService, AuthStateManagerService, SessionManagerService, TokenSyncService, FirebaseErrorHandlerService } from './core/auth';

/**
 * 應用程式配置測試
 * 
 * 驗證 Firebase Auth 整合服務是否正確配置
 */
describe('App Configuration', () => {
    beforeEach(() => {
        TestBed.configureTestingModule(appConfig);
    });

    it('should provide Firebase Auth integration services', () => {
        expect(() => TestBed.inject(FirebaseAuthAdapterService)).not.toThrow();
        expect(() => TestBed.inject(AuthStateManagerService)).not.toThrow();
        expect(() => TestBed.inject(SessionManagerService)).not.toThrow();
        expect(() => TestBed.inject(TokenSyncService)).not.toThrow();
        expect(() => TestBed.inject(FirebaseErrorHandlerService)).not.toThrow();
    });

    it('should have Firebase Auth adapter service as singleton', () => {
        const service1 = TestBed.inject(FirebaseAuthAdapterService);
        const service2 = TestBed.inject(FirebaseAuthAdapterService);
        expect(service1).toBe(service2);
    });

    it('should have Auth State Manager service as singleton', () => {
        const service1 = TestBed.inject(AuthStateManagerService);
        const service2 = TestBed.inject(AuthStateManagerService);
        expect(service1).toBe(service2);
    });

    it('should have Session Manager service as singleton', () => {
        const service1 = TestBed.inject(SessionManagerService);
        const service2 = TestBed.inject(SessionManagerService);
        expect(service1).toBe(service2);
    });

    it('should have Token Sync service as singleton', () => {
        const service1 = TestBed.inject(TokenSyncService);
        const service2 = TestBed.inject(TokenSyncService);
        expect(service1).toBe(service2);
    });

    it('should have Firebase Error Handler service as singleton', () => {
        const service1 = TestBed.inject(FirebaseErrorHandlerService);
        const service2 = TestBed.inject(FirebaseErrorHandlerService);
        expect(service1).toBe(service2);
    });
});