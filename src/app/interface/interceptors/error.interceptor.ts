import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private message: NzMessageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '發生未知錯誤';

        if (error.error instanceof ErrorEvent) {
          // 客戶端錯誤
          errorMessage = error.error.message;
        } else {
          // 服務器錯誤
          errorMessage = error.error?.message || error.message || errorMessage;
        }

        this.message.error(errorMessage);
        return throwError(() => error);
      })
    );
  }
}
