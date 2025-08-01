import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { SessionManagerService, SessionData } from './session-manager.service';
import { AuthStateManagerService } from './auth-state-manager.service';
import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';
import { FirebaseErrorHandlerService } from './firebase-error-handler.service';

describe('SessionManagerService', () => {
    let service: SessionManagerService;
    let mockAuthStateManager: jasmine.SpyObj<AuthStateManagerService>;
    let mockFirebaseAuth: jasmine.SpyObj<FirebaseAuthAdapterService>;
    let mockErrorHandler: jasmine.SpyObj<FirebaseErrorHandlerService>;

    const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/avatar.jpg'
    } as any;

    beforeEach(() => {
        const authStateManagerSpy = jasmine.createSpyObj('AuthStateManagerService', ['getCurrentState']);
        const firebaseAuthSpy = jasmine.createSpyObj('FirebaseAuthAdapterService', ['getCurrentUser']);
        const errorHandlerSpy = jasmine.createSpyObj('FirebaseErrorHandlerService',
            ['handleSessionRestoreError', 'handleSilentError']
        );

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthStateManagerService, useValue: authStateManagerSpy },
                { provide: FirebaseAuthAdapterService, useValue: firebaseAuthSpy },
                { provide: FirebaseErrorHandlerService, useValue: errorHandlerSpy }
            ]
        });

        service = TestBed.inject(SessionManagerService);
        mockAuthStateManager = TestBed.inject(AuthStateManagerService) as jasmine.SpyObj<AuthStateManagerService>;
        mockFirebaseAuth = TestBed.inject(FirebaseAuthAdapterService) as jasmine.SpyObj<FirebaseAuthAdapterService>;
        mockErrorHandler = TestBed.inject(FirebaseErrorHandlerService) as jasmine.SpyObj<FirebaseErrorHandlerService>;

        // 清除 localStorage
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('saveSession', () => {
        it('should save session data to localStorage', (done) => {
            service.saveSession(mockUser).subscribe(() => {
                const stored = localStorage.getItem('firebase_auth_session');
                expect(stored).toBeTruthy();

                const sessionData = JSON.parse(stored!) as SessionData;
                expect(sessionData.uid).toBe(mockUser.uid);
                expect(sessionData.email).toBe(mockUser.email);
                expect(sessionData.displayName).toBe(mockUser.displayName);
                expect(sessionData.photoURL).toBe(mockUser.photoURL);
                expect(sessionData.version).toBe('1.0.0');
                expect(sessionData.sessionId).toBeTruthy();
                expect(sessionData.lastActivity).toBeGreaterThan(0);
                done();
            });
        });

        it('should handle localStorage errors gracefully', (done) => {
            spyOn(localStorage, 'setItem').and.throwError('Storage error');

            service.saveSession(mockUser).subscribe(() => {
                expect(mockErrorHandler.handleSilentError).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('restoreSession', () => {
        it('should return false when no session exists', (done) => {
            service.restoreSession().subscribe(result => {
                expect(result).toBe(false);
                done();
            });
        });

        it('should return false when session is invalid', (done) => {
            // 儲存過期的會話
            const expiredSession: SessionData = {
                uid: 'test-uid',
                email: 'test@example.com',
                lastActivity: Date.now() - (25 * 60 * 60 * 1000), // 25 小時前
                sessionId: 'session_123',
                version: '1.0.0'
            };
            localStorage.setItem('firebase_auth_session', JSON.stringify(expiredSession));

            service.restoreSession().subscribe(result => {
                expect(result).toBe(false);
                expect(localStorage.getItem('firebase_auth_session')).toBeNull();
                done();
            });
        });

        it('should return true when session is valid and Firebase user matches', (done) => {
            // 儲存有效的會話
            const validSession: SessionData = {
                uid: 'test-uid',
                email: 'test@example.com',
                lastActivity: Date.now() - (1000 * 60), // 1 分鐘前
                sessionId: 'session_123',
                version: '1.0.0'
            };
            localStorage.setItem('firebase_auth_session', JSON.stringify(validSession));

            mockFirebaseAuth.getCurrentUser.and.returnValue(of(mockUser));

            service.restoreSession().subscribe(result => {
                expect(result).toBe(true);
                expect(mockFirebaseAuth.getCurrentUser).toHaveBeenCalled();
                done();
            });
        });

        it('should return false when Firebase user does not match session', (done) => {
            const validSession: SessionData = {
                uid: 'different-uid',
                email: 'test@example.com',
                lastActivity: Date.now() - (1000 * 60),
                sessionId: 'session_123',
                version: '1.0.0'
            };
            localStorage.setItem('firebase_auth_session', JSON.stringify(validSession));

            mockFirebaseAuth.getCurrentUser.and.returnValue(of(mockUser));

            service.restoreSession().subscribe(result => {
                expect(result).toBe(false);
                expect(localStorage.getItem('firebase_auth_session')).toBeNull();
                done();
            });
        });

        it('should handle Firebase errors gracefully', (done) => {
            const validSession: SessionData = {
                uid: 'test-uid',
                email: 'test@example.com',
                lastActivity: Date.now() - (1000 * 60),
                sessionId: 'session_123',
                version: '1.0.0'
            };
            localStorage.setItem('firebase_auth_session', JSON.stringify(validSession));

            mockFirebaseAuth.getCurrentUser.and.returnValue(throwError(() => new Error('Firebase error')));

            service.restoreSession().subscribe(result => {
                expect(result).toBe(false);
                expect(mockErrorHandler.handleSessionRestoreError).toHaveBeenCalled();
                expect(localStorage.getItem('firebase_auth_session')).toBeNull();
                done();
            });
        });
    });

    describe('clearSession', () => {
        it('should clear session from localStorage', (done) => {
            localStorage.setItem('firebase_auth_session', 'test-data');

            service.clearSession().subscribe(() => {
                expect(localStorage.getItem('firebase_auth_session')).toBeNull();
                done();
            });
        });
    });

    describe('validateSession', () => {
        it('should return false when no session exists', (done) => {
            service.validateSession().subscribe(result => {
                expect(result).toBe(false);
                done();
            });
        });

        it('should return true for valid session with matching Firebase user', (done) => {
            const validSession: SessionData = {
                uid: 'test-uid',
                email: 'test@example.com',
                lastActivity: Date.now() - (1000 * 60),
                sessionId: 'session_123',
                version: '1.0.0'
            };
            localStorage.setItem('firebase_auth_session', JSON.stringify(validSession));

            mockFirebaseAuth.getCurrentUser.and.returnValue(of(mockUser));

            service.validateSession().subscribe(result => {
                expect(result).toBe(true);
                done();
            });
        });

        it('should return false for invalid session version', (done) => {
            const invalidSession: SessionData = {
                uid: 'test-uid',
                email: 'test@example.com',
                lastActivity: Date.now() - (1000 * 60),
                sessionId: 'session_123',
                version: '0.9.0' // 舊版本
            };
            localStorage.setItem('firebase_auth_session', JSON.stringify(invalidSession));

            service.validateSession().subscribe(result => {
                expect(result).toBe(false);
                expect(localStorage.getItem('firebase_auth_session')).toBeNull();
                done();
            });
        });
    });

    describe('updateActivity', () => {
        it('should update session activity time', (done) => {
            const originalTime = Date.now() - (1000 * 60);
            const validSession: SessionData = {
                uid: 'test-uid',
                email: 'test@example.com',
                lastActivity: originalTime,
                sessionId: 'session_123',
                version: '1.0.0'
            };
            localStorage.setItem('firebase_auth_session', JSON.stringify(validSession));

            service.updateActivity().subscribe(() => {
                const stored = localStorage.getItem('firebase_auth_session');
                const updatedSession = JSON.parse(stored!) as SessionData;
                expect(updatedSession.lastActivity).toBeGreaterThan(originalTime);
                done();
            });
        });
    });

    describe('getCurrentSessionInfo', () => {
        it('should return current session info', () => {
            const sessionData: SessionData = {
                uid: 'test-uid',
                email: 'test@example.com',
                lastActivity: Date.now(),
                sessionId: 'session_123',
                version: '1.0.0'
            };
            localStorage.setItem('firebase_auth_session', JSON.stringify(sessionData));

            const result = service.getCurrentSessionInfo();
            expect(result).toEqual(jasmine.objectContaining({
                uid: 'test-uid',
                email: 'test@example.com',
                sessionId: 'session_123',
                version: '1.0.0'
            }));
        });

        it('should return null when no session exists', () => {
            const result = service.getCurrentSessionInfo();
            expect(result).toBeNull();
        });
    });
});