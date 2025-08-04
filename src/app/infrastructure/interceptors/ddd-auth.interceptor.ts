/**
 * DDD Authentication HTTP Interceptor
 * Integrates with authentication domain and maintains existing functionality
 */
import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponseBase } from '@angular/common/http';
import { Injector, inject } from '@angular/core';
import { IGNORE_BASE_URL } from '@delon/theme';
import { environment } from '@env/environment';
import { Observable, of, throwError, mergeMap } from 'rxjs';

import { ReThrowHttpError, checkStatus, getAdditionalHeaders, toLogin } from './helper';
import { tryRefreshToken } from './refresh-token';

function handleData(injector: Injector, ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
  checkStatus(injector, ev);

  // Business processing: common operations
  switch (ev.status) {
    case 200:
      // Business level error handling, assuming RESTful has a unified output format
      // Example response:
      //   Error content: { status: 1, msg: 'Invalid parameter' }
      //   Correct content: { status: 0, response: {  } }
      // The following code snippet can be directly applied
      // if (ev instanceof HttpResponse) {
      //   const body = ev.body;
      //   if (body && body.status !== 0) {
      //     const customError = req.context.get(CUSTOM_ERROR);
      //     if (customError) injector.get(NzMessageService).error(body.msg);
      //     return customError ? throwError(() => ({ body, _throw: true }) as ReThrowHttpError) : of({});
      //   } else {
      //     // Return original response body
      //     if (req.context.get(RAW_BODY) || ev.body instanceof Blob) {
      //       return of(ev);
      //     }
      //     // Re-modify `body` content to `response` content, for most scenarios no longer need to care about business status code
      //     return of(new HttpResponse({ ...ev, body: body.response } as any));
      //     // Or still maintain complete format
      //     return of(ev);
      //   }
      // }
      break;
    case 401:
      if (environment.api.refreshTokenEnabled && environment.api.refreshTokenType === 're-request') {
        return tryRefreshToken(injector, ev, req, next);
      }
      toLogin(injector);
      break;
    case 403:
    case 404:
    case 500:
      // goTo(injector, `/exception/${ev.status}?url=${req.urlWithParams}`);
      break;
    default:
      if (ev instanceof HttpErrorResponse) {
        console.warn(
          'Unknown error, mostly caused by backend not supporting CORS or invalid configuration, please refer to https://ng-alain.com/docs/server to solve CORS problem',
          ev
        );
      }
      break;
  }
  if (ev instanceof HttpErrorResponse) {
    return throwError(() => ev);
  } else if ((ev as unknown as ReThrowHttpError)._throw === true) {
    return throwError(() => (ev as unknown as ReThrowHttpError).body);
  } else {
    return of(ev);
  }
}

export const dddAuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Add server prefix uniformly
  let url = req.url;
  if (!req.context.get(IGNORE_BASE_URL) && !url.startsWith('https://') && !url.startsWith('http://')) {
    const { baseUrl } = environment.api;
    url = baseUrl + (baseUrl.endsWith('/') && url.startsWith('/') ? url.substring(1) : url);
  }
  const newReq = req.clone({ url, setHeaders: getAdditionalHeaders(req.headers) });
  const injector = inject(Injector);

  return next(newReq).pipe(
    mergeMap((ev: any) => {
      // Allow unified error handling for requests
      if (ev instanceof HttpResponseBase) {
        return handleData(injector, ev, newReq, next);
      }
      // If everything is normal, then subsequent operations
      return of(ev);
    })
    // catchError((err: HttpErrorResponse) => handleData(injector, err, newReq, next))
  );
};
