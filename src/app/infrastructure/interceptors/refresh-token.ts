/**
 * Refresh token functionality for DDD authentication interceptor
 */
import { HttpClient, HttpHandlerFn, HttpRequest, HttpResponseBase } from '@angular/common/http';
import { EnvironmentProviders, Injector, inject, provideAppInitializer } from '@angular/core';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError, of } from 'rxjs';

import { toLogin } from './helper';
import { AuthApplicationService } from '../../application/services/auth-application.service';

let refreshToking = false;
let refreshToken$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

/**
 * Re-attach new Token information
 *
 * > Since requests that have already been initiated will not go through `@delon/auth` again,
 *   it is necessary to re-attach the new Token in combination with the business situation
 */
function reAttachToken(injector: Injector, req: HttpRequest<any>): HttpRequest<any> {
  const token = injector.get(DA_SERVICE_TOKEN).get()?.token;
  return req.clone({
    setHeaders: {
      token: `Bearer ${token}`
    }
  });
}

function refreshTokenRequest(injector: Injector): Observable<any> {
  const model = injector.get(DA_SERVICE_TOKEN).get();
  return injector.get(HttpClient).post(`/api/auth/refresh`, { headers: { refresh_token: model?.['refresh_token'] || '' } });
}

/**
 * Refresh Token method 1: Use 401 to refresh Token
 */
export function tryRefreshToken(injector: Injector, ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
  // 1. If the request is a refresh Token request, it means it comes from refresh Token and can directly jump to the login page
  if ([`/api/auth/refresh`].some(url => req.url.includes(url))) {
    toLogin(injector);
    return throwError(() => ev);
  }
  // 2. If `refreshToking` is `true`, it means that the refresh Token is already being requested,
  //    and all subsequent requests will enter the waiting state until the result is returned and then re-initiate the request
  if (refreshToking) {
    return refreshToken$.pipe(
      filter(v => !!v),
      take(1),
      switchMap(() => next(reAttachToken(injector, req)))
    );
  }
  // 3. Try to call refresh Token
  refreshToking = true;
  refreshToken$.next(null);

  return refreshTokenRequest(injector).pipe(
    switchMap(res => {
      // Notify subsequent requests to continue execution
      refreshToking = false;
      refreshToken$.next(res);
      // Re-save new token
      injector.get(DA_SERVICE_TOKEN).set(res);
      // Re-initiate request
      return next(reAttachToken(injector, req));
    }),
    catchError(err => {
      refreshToking = false;
      toLogin(injector);
      return throwError(() => err);
    })
  );
}

function buildAuthRefresh(injector: Injector): void {
  const tokenSrv = injector.get(DA_SERVICE_TOKEN);
  tokenSrv.refresh
    .pipe(
      filter(() => !refreshToking),
      switchMap(res => {
        console.log(res);
        refreshToking = true;
        return refreshTokenRequest(injector);
      })
    )
    .subscribe({
      next: res => {
        // TODO: Mock expired value
        res.expired = +new Date() + 1000 * 60 * 5;
        refreshToking = false;
        tokenSrv.set(res);
      },
      error: () => toLogin(injector)
    });
}

/**
 * Refresh Token method 2: Use the `refresh` interface of `@delon/auth`,
 * which needs to be registered in `app.config.ts` with `provideBindAuthRefresh`
 */
export function provideBindAuthRefresh(): EnvironmentProviders[] {
  return [
    provideAppInitializer(() => {
      const initializerFn = (
        (injector: Injector) => () =>
          buildAuthRefresh(injector)
      )(inject(Injector));
      return initializerFn();
    })
  ];
}

/**
 * Check if token needs refresh
 */
export function needsTokenRefresh(token: string | null): boolean {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    const buffer = 5 * 60 * 1000; // 5 minutes buffer

    return now >= exp - buffer;
  } catch {
    return true;
  }
}

/**
 * Get token from authentication service
 */
export function getTokenFromAuthService(injector: Injector): Observable<string | null> {
  const authService = injector.get(AuthApplicationService);
  return authService.getCurrentAuthentication().pipe(
    switchMap(auth => {
      if (!auth) return of(null);
      const session = auth.getSession();
      return of(session?.token || null);
    })
  );
}
