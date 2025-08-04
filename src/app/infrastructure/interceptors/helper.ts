/**
 * Helper functions for DDD authentication interceptor
 */
import { HttpHeaders, HttpResponseBase } from '@angular/common/http';
import { Injector, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { ALAIN_I18N_TOKEN } from '@delon/theme';
import { NzNotificationService } from 'ng-zorro-antd/notification';

export interface ReThrowHttpError {
  body: any;
  _throw: true;
}

export const CODEMESSAGE: Record<number, string> = {
  200: 'Server successfully returned the requested data.',
  201: 'New or modified data successfully.',
  202: 'A request has entered the background queue (asynchronous task).',
  204: 'Delete data successfully.',
  400: 'The request sent has an error, and the server did not perform the operation of creating or modifying data.',
  401: 'User has no permission (token, username, password error).',
  403: 'User is authorized, but access is forbidden.',
  404: 'The request sent is for a record that does not exist, and the server did not perform the operation.',
  406: 'The format of the request is not available.',
  410: 'The requested resource is permanently deleted and will no longer be available.',
  422: 'When creating an object, a validation error occurred.',
  500: 'Server error, please check the server.',
  502: 'Gateway error.',
  503: 'Service unavailable, server temporarily overloaded or maintained.',
  504: 'Gateway timeout.'
};

export function goTo(injector: Injector, url: string): void {
  setTimeout(() => injector.get(Router).navigateByUrl(url));
}

export function toLogin(injector: Injector): void {
  injector.get(NzNotificationService).error(`Not logged in or login has expired, please log in again.`, ``);
  goTo(injector, injector.get(DA_SERVICE_TOKEN).login_url!);
}

export function getAdditionalHeaders(headers?: HttpHeaders): Record<string, string> {
  const res: Record<string, string> = {};
  const lang = inject(ALAIN_I18N_TOKEN).currentLang;
  if (!headers?.has('Accept-Language') && lang) {
    res['Accept-Language'] = lang;
  }

  return res;
}

export function checkStatus(injector: Injector, ev: HttpResponseBase): void {
  if ((ev.status >= 200 && ev.status < 300) || ev.status === 401) {
    return;
  }

  const errortext = CODEMESSAGE[ev.status] || ev.statusText;
  injector.get(NzNotificationService).error(`Request error ${ev.status}: ${ev.url}`, errortext);
}
