import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, throwError } from 'rxjs';
import { firebaseAuthGuard, firebaseAuthChildGuard } from './firebase-auth.guard';
import { AuthStateManagerService } from './auth-state-manager.service';

describe('firebaseAuthGuard', () => {
    let mockAuthStateManager: jasmine.SpyObj<AuthStateManagerService>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    const mockAuthenticatedState = {
        isAuthenticated: true,
        user: { uid: 'test-uid', email: 'test@example.com' },
        token: 'mock-token',
        loading: false,
        error: null
    };

    const mockUnauthenticatedState = {
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null
    };

    beforeEach(() => {
        const authStateManagerSpy = jasmine.createSpyObj('AuthStateManagerService', [], {
            authState$: of(mockAuthenticatedState)
        });
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthStateManagerService, useValue: authStateManagerSpy },
                { provide: Router, useValue: routerSpy }
            ]
        });

        mockAuthStateManager = TestBed.inject(AuthStateManagerService) as jasmine.SpyObj<AuthStateManagerService>;
        mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        // Mock route and state objects
        mockRoute = {} as ActivatedRouteSnapshot;
        mockState = { url: '/dashboard' } as RouterStateSnapshot;
    });

    it('should allow access when user is authenticated', (done) => {
        Object.defineProperty(mockAuthStateManager, 'authState$', {
            value: of(mockAuthenticatedState)
        });

        TestBed.runInInjectionContext(() => {
            const result = firebaseAuthGuard(mockRoute, mockState);
            if (result instanceof Promise) {
                result.then(res => {
                    expect(res).toBe(true);
                    expect(mockRouter.navigate).not.toHaveBeenCalled();
                    done();
                });
            } else if (typeof result === 'object' && 'subscribe' in result) {
                result.subscribe(res => {
                    expect(res).toBe(true);
                    expect(mockRouter.navigate).not.toHaveBeenCalled();
                    done();
                });
            } else {
                expect(result).toBe(true);
                expect(mockRouter.navigate).not.toHaveBeenCalled();
                done();
            }
        });
    });

    it('should deny access and redirect when user is not authenticated', (done) => {
        Object.defineProperty(mockAuthStateManager, 'authState$', {
            value: of(mockUnauthenticatedState)
        });

        TestBed.runInInjectionContext(() => {
            const result = firebaseAuthGuard(mockRoute, mockState);
            if (result instanceof Promise) {
                result.then(res => {
                    expect(res).toBe(false);
                    expect(mockRouter.navigate).toHaveBeenCalledWith(['/passport/login']);
                    done();
                });
            } else if (typeof result === 'object' && 'subscribe' in result) {
                result.subscribe(res => {
                    expect(res).toBe(false);
                    expect(mockRouter.navigate).toHaveBeenCalledWith(['/passport/login']);
                    done();
                });
            } else {
                expect(result).toBe(false);
                expect(mockRouter.navigate).toHaveBeenCalledWith(['/passport/login']);
                done();
            }
        });
    });

    it('should handle errors by redirecting to login', (done) => {
        Object.defineProperty(mockAuthStateManager, 'authState$', {
            value: throwError(() => new Error('Test error'))
        });

        TestBed.runInInjectionContext(() => {
            const result = firebaseAuthGuard(mockRoute, mockState);
            if (result instanceof Promise) {
                result.then(res => {
                    expect(res).toBe(false);
                    expect(mockRouter.navigate).toHaveBeenCalledWith(['/passport/login']);
                    done();
                });
            } else if (typeof result === 'object' && 'subscribe' in result) {
                result.subscribe(res => {
                    expect(res).toBe(false);
                    expect(mockRouter.navigate).toHaveBeenCalledWith(['/passport/login']);
                    done();
                });
            } else {
                expect(result).toBe(false);
                expect(mockRouter.navigate).toHaveBeenCalledWith(['/passport/login']);
                done();
            }
        });
    });
});

describe('firebaseAuthChildGuard', () => {
    let mockAuthStateManager: jasmine.SpyObj<AuthStateManagerService>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    const mockAuthenticatedState = {
        isAuthenticated: true,
        user: { uid: 'test-uid', email: 'test@example.com' },
        token: 'mock-token',
        loading: false,
        error: null
    };

    beforeEach(() => {
        const authStateManagerSpy = jasmine.createSpyObj('AuthStateManagerService', [], {
            authState$: of(mockAuthenticatedState)
        });
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthStateManagerService, useValue: authStateManagerSpy },
                { provide: Router, useValue: routerSpy }
            ]
        });

        mockAuthStateManager = TestBed.inject(AuthStateManagerService) as jasmine.SpyObj<AuthStateManagerService>;
        mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        // Mock route and state objects
        mockRoute = {} as ActivatedRouteSnapshot;
        mockState = { url: '/dashboard' } as RouterStateSnapshot;
    });

    it('should work the same as firebaseAuthGuard', (done) => {
        Object.defineProperty(mockAuthStateManager, 'authState$', {
            value: of(mockAuthenticatedState)
        });

        TestBed.runInInjectionContext(() => {
            const result = firebaseAuthChildGuard(mockRoute, mockState);
            if (result instanceof Promise) {
                result.then(res => {
                    expect(res).toBe(true);
                    done();
                });
            } else if (typeof result === 'object' && 'subscribe' in result) {
                result.subscribe(res => {
                    expect(res).toBe(true);
                    done();
                });
            } else {
                expect(result).toBe(true);
                done();
            }
        });
    });
});