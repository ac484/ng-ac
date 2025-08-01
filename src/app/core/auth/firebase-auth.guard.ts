import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthStateManagerService } from './auth-state-manager.service';

/**
 * Firebase Auth Guard
 * 
 * 基於 Firebase 認證狀態的路由守衛
 * 與 ng-alain 的 authSimpleCanActivate 相容
 */
export const firebaseAuthGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<boolean> => {
    const authStateManager = inject(AuthStateManagerService);
    const router = inject(Router);

    return authStateManager.authState$.pipe(
        map(authState => {
            if (authState.isAuthenticated) {
                return true;
            } else {
                // 重定向到登入頁面
                router.navigate(['/passport/login']);
                return false;
            }
        }),
        catchError(() => {
            // 發生錯誤時重定向到登入頁面
            router.navigate(['/passport/login']);
            return of(false);
        })
    );
};

/**
 * Firebase Auth Child Guard
 * 
 * 用於子路由的 Firebase 認證守衛
 */
export const firebaseAuthChildGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    return firebaseAuthGuard(route, state);
};