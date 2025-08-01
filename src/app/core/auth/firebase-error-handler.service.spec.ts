import { TestBed } from '@angular/core/testing';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FirebaseErrorHandlerService, FirebaseErrorMapping } from './firebase-error-handler.service';

describe('FirebaseErrorHandlerService', () => {
    let service: FirebaseErrorHandlerService;
    let mockMessageService: jasmine.SpyObj<NzMessageService>;

    beforeEach(() => {
        const messageSpy = jasmine.createSpyObj('NzMessageService', ['error', 'warning', 'info']);

        TestBed.configureTestingModule({
            providers: [
                { provide: NzMessageService, useValue: messageSpy }
            ]
        });

        service = TestBed.inject(FirebaseErrorHandlerService);
        mockMessageService = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('handleError', () => {
        it('should handle known Firebase auth errors', () => {
            const error = { code: 'auth/user-not-found' };
            const result = service.handleError(error);

            expect(result).toBe('找不到此用戶，請檢查 Email 是否正確');
            expect(mockMessageService.error).toHaveBeenCalledWith(
                '找不到此用戶，請檢查 Email 是否正確',
                { nzDuration: 5000 }
            );
        });

        it('should handle unknown errors with default message', () => {
            const error = { code: 'unknown-error-code', message: 'Some unknown error' };
            const result = service.handleError(error);

            expect(result).toBe('Some unknown error');
            expect(mockMessageService.error).toHaveBeenCalledWith(
                'Some unknown error',
                { nzDuration: 5000 }
            );
        });

        it('should handle string errors', () => {
            const error = 'auth/invalid-email';
            const result = service.handleError(error);

            expect(result).toBe('Email 格式不正確');
            expect(mockMessageService.error).toHaveBeenCalledWith(
                'Email 格式不正確',
                { nzDuration: 5000 }
            );
        });

        it('should not show notification when showNotification is false', () => {
            const error = { code: 'auth/user-not-found' };
            const result = service.handleError(error, false);

            expect(result).toBe('找不到此用戶，請檢查 Email 是否正確');
            expect(mockMessageService.error).not.toHaveBeenCalled();
        });

        it('should show warning notification for warning severity errors', () => {
            const error = { code: 'auth/too-many-requests' };
            service.handleError(error);

            expect(mockMessageService.warning).toHaveBeenCalledWith(
                '登入嘗試次數過多，請稍後再試',
                { nzDuration: 4000 }
            );
        });
    });

    describe('handleTokenRefreshError', () => {
        it('should handle token refresh errors', () => {
            const error = new Error('Token refresh failed');
            service.handleTokenRefreshError(error);

            expect(mockMessageService.warning).toHaveBeenCalledWith(
                '登入已過期，請重新登入',
                { nzDuration: 4000 }
            );
        });
    });

    describe('handleSessionRestoreError', () => {
        it('should handle session restore errors', () => {
            const error = new Error('Session restore failed');
            service.handleSessionRestoreError(error);

            expect(mockMessageService.info).toHaveBeenCalledWith(
                '會話恢復失敗，將重新導向到登入頁面',
                { nzDuration: 3000 }
            );
        });
    });

    describe('handleAuthStateError', () => {
        it('should handle auth state errors', () => {
            const error = new Error('Auth state error');
            service.handleAuthStateError(error);

            expect(mockMessageService.error).toHaveBeenCalledWith(
                '認證狀態異常，請重新登入',
                { nzDuration: 5000 }
            );
        });
    });

    describe('handleSilentError', () => {
        it('should handle errors without showing notifications', () => {
            const error = { code: 'auth/user-not-found' };
            const result = service.handleSilentError(error);

            expect(result).toBe('找不到此用戶，請檢查 Email 是否正確');
            expect(mockMessageService.error).not.toHaveBeenCalled();
            expect(mockMessageService.warning).not.toHaveBeenCalled();
            expect(mockMessageService.info).not.toHaveBeenCalled();
        });
    });

    describe('getErrorMappings', () => {
        it('should return all error mappings', () => {
            const mappings = service.getErrorMappings();

            expect(mappings).toBeInstanceOf(Array);
            expect(mappings.length).toBeGreaterThan(0);

            // 檢查是否包含一些預期的錯誤映射
            const userNotFoundMapping = mappings.find(m => m.code === 'auth/user-not-found');
            expect(userNotFoundMapping).toBeDefined();
            expect(userNotFoundMapping?.message).toBe('找不到此用戶，請檢查 Email 是否正確');
            expect(userNotFoundMapping?.severity).toBe('error');
        });
    });

    describe('error severity handling', () => {
        it('should show error notification for error severity', () => {
            const error = { code: 'auth/user-disabled' };
            service.handleError(error);

            expect(mockMessageService.error).toHaveBeenCalledWith(
                '此帳戶已被停用，請聯繫管理員',
                { nzDuration: 5000 }
            );
        });

        it('should show warning notification for warning severity', () => {
            const error = { code: 'auth/weak-password' };
            service.handleError(error);

            expect(mockMessageService.warning).toHaveBeenCalledWith(
                '密碼強度不足，請使用至少 6 個字元',
                { nzDuration: 4000 }
            );
        });
    });

    describe('console logging', () => {
        it('should log errors to console', () => {
            spyOn(console, 'error');
            const error = { code: 'auth/user-not-found', message: 'User not found' };

            service.handleError(error);

            expect(console.error).toHaveBeenCalledWith(
                '[Firebase Auth Error]',
                jasmine.objectContaining({
                    errorCode: 'auth/user-not-found',
                    userMessage: '找不到此用戶，請檢查 Email 是否正確',
                    originalError: error
                })
            );
        });
    });
});