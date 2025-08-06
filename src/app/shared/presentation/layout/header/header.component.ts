import { Component, EventEmitter, Input, Output, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Subscription } from 'rxjs';
import { ThemeSwitcherComponent } from '../../components/theme-switcher/theme-switcher.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.less'],
    standalone: true,
    imports: [CommonModule, NzIconModule, NzAvatarModule, NzDropDownModule, NzMenuModule, ThemeSwitcherComponent]
})
export class HeaderComponent implements OnInit, OnDestroy {
    @Input() isCollapsed!: boolean;
    @Output() isCollapsedChange = new EventEmitter<boolean>();

    private readonly auth = inject(Auth);
    private readonly router = inject(Router);
    private readonly message = inject(NzMessageService);

    currentUser$: Observable<User | null>;
    username: string = '訪客';
    userAvatar: string = 'assets/tmp/img/avatar.jpg';
    private authSubscription?: Subscription;

    constructor() {
        this.currentUser$ = new Observable(observer => {
            const unsubscribe = onAuthStateChanged(this.auth, (user) => {
                observer.next(user);
                if (user) {
                    // 根據用戶類型設置不同的顯示名稱
                    if (user.isAnonymous) {
                        this.username = '匿名用戶';
                        this.userAvatar = 'assets/tmp/img/avatar.jpg';
                    } else {
                        this.username = user.displayName || user.email || '用戶';
                        this.userAvatar = user.photoURL || 'assets/tmp/img/avatar.jpg';
                    }
                    console.log('當前用戶:', this.username, user.isAnonymous ? '(匿名)' : '');
                } else {
                    this.username = '訪客';
                    this.userAvatar = 'assets/tmp/img/avatar.jpg';
                }
            });
            return unsubscribe;
        });
    }

    ngOnInit(): void {
        // 訂閱用戶狀態變化
        this.authSubscription = this.currentUser$.subscribe(user => {
            if (user) {
                console.log('用戶已登入:', user.email, user.isAnonymous ? '(匿名)' : '');
            } else {
                console.log('用戶已登出');
            }
        });
    }

    ngOnDestroy(): void {
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }
    }

    toggleCollapse(): void {
        this.isCollapsed = !this.isCollapsed;
        this.isCollapsedChange.emit(this.isCollapsed);
    }

    async logout(): Promise<void> {
        try {
            console.log('開始登出...');
            await this.auth.signOut();
            console.log('Firebase登出成功');
            this.message.success('登出成功');
            // 導航到登入頁面
            await this.router.navigate(['/auth/login']);
        } catch (error) {
            console.error('登出失敗:', error);
            this.message.error('登出失敗，請重試');
        }
    }
}

