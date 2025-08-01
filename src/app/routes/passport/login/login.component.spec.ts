import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN, SocialService } from '@delon/auth';
import { SettingsService, _HttpClient } from '@delon/theme';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { of } from 'rxjs';

import { UserLoginComponent } from './login.component';
import { FirebaseAuthAdapterService } from '../../../core/auth/firebase-auth-adapter.service';
import { AuthStateManagerService } from '../../../core/auth/auth-state-manager.service';

describe('UserLoginComponent', () => {
    let component: UserLoginComponent;
    let fixture: ComponentFixture<UserLoginComponent>;
    let mockFirebaseAuth: jasmine.SpyObj<FirebaseAuthAdapterService>;
    let mockAuthStateManager: jasmine.SpyObj<AuthStateManagerService>;

    beforeEach(async () => {
        const firebaseAuthSpy = jasmine.createSpyObj('FirebaseAuthAdapterService', ['signIn']);
        const authStateManagerSpy = jasmine.createSpyObj('AuthStateManagerService', ['getCurrentState']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
        const settingsServiceSpy = jasmine.createSpyObj('SettingsService', ['setUser']);
        const socialServiceSpy = jasmine.createSpyObj('SocialService', ['login']);
        const tokenServiceSpy = jasmine.createSpyObj('TokenService', ['set', 'get']);
        const startupServiceSpy = jasmine.createSpyObj('StartupService', ['load']);
        const httpClientSpy = jasmine.createSpyObj('_HttpClient', ['post']);

        await TestBed.configureTestingModule({
            imports: [
                UserLoginComponent,
                ReactiveFormsModule,
                NzAlertModule,
                NzButtonModule,
                NzCheckboxModule,
                NzFormModule,
                NzIconModule,
                NzInputModule,
                NzTabsModule,
                NzToolTipModule
            ],
            providers: [
                { provide: FirebaseAuthAdapterService, useValue: firebaseAuthSpy },
                { provide: AuthStateManagerService, useValue: authStateManagerSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
                { provide: SettingsService, useValue: settingsServiceSpy },
                { provide: SocialService, useValue: socialServiceSpy },
                { provide: DA_SERVICE_TOKEN, useValue: tokenServiceSpy },
                { provide: StartupService, useValue: startupServiceSpy },
                { provide: _HttpClient, useValue: httpClientSpy },
                { provide: ReuseTabService, useValue: null }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(UserLoginComponent);
        component = fixture.componentInstance;
        mockFirebaseAuth = TestBed.inject(FirebaseAuthAdapterService) as jasmine.SpyObj<FirebaseAuthAdapterService>;
        mockAuthStateManager = TestBed.inject(AuthStateManagerService) as jasmine.SpyObj<AuthStateManagerService>;

        // 設定預設的 mock 回傳值
        mockFirebaseAuth.signIn.and.returnValue(of({ uid: 'test-uid' } as any));
        (TestBed.inject(StartupService) as jasmine.SpyObj<StartupService>).load.and.returnValue(of(void 0));

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have email validation for userName field', () => {
        const userNameControl = component.form.controls.userName;

        // 測試無效的 email
        userNameControl.setValue('invalid-email');
        expect(userNameControl.invalid).toBeTruthy();

        // 測試有效的 email
        userNameControl.setValue('test@example.com');
        expect(userNameControl.valid).toBeTruthy();
    });

    it('should have minimum length validation for password field', () => {
        const passwordControl = component.form.controls.password;

        // 測試太短的密碼
        passwordControl.setValue('123');
        expect(passwordControl.invalid).toBeTruthy();

        // 測試符合最小長度的密碼
        passwordControl.setValue('123456');
        expect(passwordControl.valid).toBeTruthy();
    });

    it('should call Firebase auth service on form submission', () => {
        component.form.patchValue({
            userName: 'test@example.com',
            password: '123456'
        });

        component.submit();

        expect(mockFirebaseAuth.signIn).toHaveBeenCalledWith('test@example.com', '123456');
    });
});