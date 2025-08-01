import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { of } from 'rxjs';

import { HeaderUserComponent } from './user.component';
import { FirebaseAuthAdapterService } from '../../../core/auth/firebase-auth-adapter.service';
import { AuthStateManagerService } from '../../../core/auth/auth-state-manager.service';

describe('HeaderUserComponent', () => {
    let component: HeaderUserComponent;
    let fixture: ComponentFixture<HeaderUserComponent>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockTokenService: jasmine.SpyObj<any>;
    let mockSettingsService: jasmine.SpyObj<SettingsService>;
    let mockFirebaseAuth: jasmine.SpyObj<FirebaseAuthAdapterService>;
    let mockAuthStateManager: jasmine.SpyObj<AuthStateManagerService>;

    beforeEach(async () => {
        mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
        mockTokenService = jasmine.createSpyObj('TokenService', ['clear'], {
            login_url: '/passport/login'
        });
        mockSettingsService = jasmine.createSpyObj('SettingsService', [], {
            user: { name: 'Test User', avatar: 'test-avatar.jpg', email: 'test@example.com' }
        });
        mockFirebaseAuth = jasmine.createSpyObj('FirebaseAuthAdapterService', [], {
            authState$: of({ displayName: 'Firebase User', email: 'firebase@example.com', photoURL: 'firebase-avatar.jpg' })
        });
        mockAuthStateManager = jasmine.createSpyObj('AuthStateManagerService', ['clearSession']);

        await TestBed.configureTestingModule({
            imports: [HeaderUserComponent],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: DA_SERVICE_TOKEN, useValue: mockTokenService },
                { provide: SettingsService, useValue: mockSettingsService },
                { provide: FirebaseAuthAdapterService, useValue: mockFirebaseAuth },
                { provide: AuthStateManagerService, useValue: mockAuthStateManager }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HeaderUserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display Firebase user information', () => {
        expect(component.currentUser$).toBeDefined();
        component.currentUser$.subscribe(user => {
            expect(user?.displayName).toBe('Firebase User');
            expect(user?.email).toBe('firebase@example.com');
        });
    });

    it('should call AuthStateManagerService.clearSession on logout', () => {
        mockAuthStateManager.clearSession.and.returnValue(of(void 0));

        component.logout();

        expect(mockAuthStateManager.clearSession).toHaveBeenCalled();
    });

    it('should handle logout error gracefully', () => {
        mockAuthStateManager.clearSession.and.returnValue(of(void 0).pipe(() => {
            throw new Error('Logout failed');
        }));

        spyOn(console, 'error');
        component.logout();

        expect(console.error).toHaveBeenCalledWith('Logout error:', jasmine.any(Error));
    });
});