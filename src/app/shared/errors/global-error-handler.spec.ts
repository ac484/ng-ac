/**
 * 全域錯誤處理器測試
 */

import { TestBed } from '@angular/core/testing';
import { NgZone } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GlobalErrorHandler, ErrorSeverity } from './global-error-handler';
import { ValidationError } from './validation-error';
import { AuthenticationError } from './authentication-error';
import { NotFoundError } from './not-found-error';
import { NetworkError } from './network-error';
import { ApplicationError } from './application-error';

describe('GlobalErrorHandler', () => {
    let errorHandler: GlobalErrorHandler;
    let mockNgZone: jasmine.SpyObj<NgZone>;
    let mockMessageService: jasmine.SpyObj<NzMessageService>;
    let mockNotificationService: jasmine.SpyObj<NzNotificationService>;

    beforeEach(() => {
        const ngZoneSpy = jasmine.createSpyObj('NgZone', ['run', 'runOutsideAngular']);
        const messageServiceSpy = jasmine.createSpyObj('NzMessageService', ['success', 'error', 'warning', 'info']);
        const notificationServiceSpy = jasmine.createSpyObj('NzNotificationService', ['success', 'error', 'warning', 'info']);

        TestBed.configureTestingModule({
            providers: [
                GlobalErrorHandler,
                { provide: NgZone, useValue: ngZoneSpy },
                { provide: NzMessageService, useValue: messageServiceSpy },
                { provide: NzNotificationService, useValue: notificationServiceSpy }
            ]
        });

        errorHandler = TestBed.inject(GlobalErrorHandler);
        mockNgZone = TestBed.inject(NgZone) as jasmine.SpyObj<NgZone>;
        mockMessageService = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;
        mockNotificationService = TestBed.inject(NzNotificationService) as jasmine.SpyObj<NzNotificationService>;

        // 設定 NgZone mock 行為
        mockNgZone.run.and.callFake((fn: Function) => fn());
        mockNgZone.runOutsideAngular.and.callFake((fn: Function) => fn());
    });

    afterEach(() => {
        errorHandler.clearErrorStats();
    });

    describe('handleError', () => {
        it('should handle generic errors', () => {
            const error = new Error('Test error');

            errorHandler.handleError(error);

            expect(mockNgZone.runOutsideAngular).toHaveBeenCalled();
            expect(mockMessageService.error).toHaveBeenCalled();
        });

        it('should handle validation errors with low severity', () => {
            const error = new ValidationError('Validation failed', 'email');

            errorHandler.handleErrorWithOptions(error);

            expect(mockMessageService.warning).toHaveBeenCalled();
        });

        it('should handle authentication errors with medium severity', () => {
            const error = new AuthenticationError('Auth failed');

            errorHandler.handleErrorWithOptions(error);

            expect(mockMessageService.error).toHaveBeenCalled();
        });

        it('should handle network errors with appropriate severity', () => {
            const error = NetworkError.httpError(500, 'Internal Server Error');

            errorHandler.handleErrorWithOptions(error);

            expect(mockNotificationService.error).toHaveBeenCalled();
        });

        it('should handle not found errors with low severity', () => {
            const error = NotFoundError.userNotFound('user123');

            errorHandler.handleErrorWithOptions(error);

            expect(mockMessageService.warning).toHaveBeenCalled();
        });
    });

    describe('error deduplication', () => {
        it('should not show duplicate errors within deduplication window', () => {
            const error = new ValidationError('Same error', 'email');

            // 第一次錯誤應該顯示
            errorHandler.handleErrorWithOptions(error);
            expect(mockMessageService.warning).toHaveBeenCalledTimes(1);

            // 第二次相同錯誤不應該顯示
            errorHandler.handleErrorWithOptions(error);
            expect(mockMessageService.warning).toHaveBeenCalledTimes(1);
        });
    });

    describe('error statistics', () => {
        it('should track error statistics', () => {
            const error1 = new ValidationError('Validation error');
            const error2 = new AuthenticationError('Auth error');

            errorHandler.handleErrorWithOptions(error1);
            errorHandler.handleErrorWithOptions(error2);

            const stats = errorHandler.getErrorStats();
            expect(stats.totalErrors).toBe(2);
            expect(stats.errorsByType['ValidationError']).toBe(1);
            expect(stats.errorsByType['AuthenticationError']).toBe(1);
            expect(stats.recentErrors.length).toBe(2);
        });

        it('should clear error statistics', () => {
            const error = new ValidationError('Test error');
            errorHandler.handleErrorWithOptions(error);

            let stats = errorHandler.getErrorStats();
            expect(stats.totalErrors).toBe(1);

            errorHandler.clearErrorStats();
            stats = errorHandler.getErrorStats();
            expect(stats.totalErrors).toBe(0);
        });
    });

    describe('success and info messages', () => {
        it('should handle success messages', () => {
            errorHandler.handleSuccess('Operation successful');

            expect(mockNgZone.run).toHaveBeenCalled();
            expect(mockMessageService.success).toHaveBeenCalledWith('Operation successful', jasmine.any(Object));
        });

        it('should handle warning messages', () => {
            errorHandler.handleWarning('Warning message');

            expect(mockNgZone.run).toHaveBeenCalled();
            expect(mockMessageService.warning).toHaveBeenCalledWith('Warning message', jasmine.any(Object));
        });

        it('should handle info messages', () => {
            errorHandler.handleInfo('Info message');

            expect(mockNgZone.run).toHaveBeenCalled();
            expect(mockMessageService.info).toHaveBeenCalledWith('Info message', jasmine.any(Object));
        });
    });

    describe('error retry logic', () => {
        it('should identify retryable errors', () => {
            const retryableError = NetworkError.httpError(503, 'Service Unavailable');
            const nonRetryableError = new ValidationError('Invalid input');

            expect(errorHandler.isRetryableError(retryableError)).toBe(true);
            expect(errorHandler.isRetryableError(nonRetryableError)).toBe(false);
        });

        it('should provide retry delay for errors', () => {
            const error = NetworkError.httpError(429, 'Too Many Requests');
            const delay = errorHandler.getRetryDelay(error);

            expect(delay).toBeGreaterThan(0);
        });
    });

    describe('error severity determination', () => {
        it('should determine correct severity for different error types', () => {
            // 這個測試需要訪問私有方法，所以我們通過 handleErrorWithOptions 來間接測試
            const validationError = new ValidationError('Validation failed');
            const authError = new AuthenticationError('Auth failed');
            const networkError = NetworkError.httpError(500, 'Server Error');
            const appError = new ApplicationError('App error');

            // 通過檢查調用的方法來驗證嚴重程度
            errorHandler.handleErrorWithOptions(validationError);
            expect(mockMessageService.warning).toHaveBeenCalled();

            errorHandler.handleErrorWithOptions(authError);
            expect(mockMessageService.error).toHaveBeenCalled();

            errorHandler.handleErrorWithOptions(networkError);
            expect(mockNotificationService.error).toHaveBeenCalled();

            errorHandler.handleErrorWithOptions(appError);
            expect(mockMessageService.error).toHaveBeenCalled();
        });
    });
});