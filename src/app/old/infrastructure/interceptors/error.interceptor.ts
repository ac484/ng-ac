import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalErrorHandler } from '../../shared/services/error-handler.service';
import { BaseError, ValidationError, NotFoundError, ApplicationError } from '../../domain/errors/custom-errors';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly errorHandler = inject(GlobalErrorHandler);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let appError: BaseError;

        switch (error.status) {
          case 400:
            appError = new ValidationError(error.error?.message || 'Invalid request parameters');
            break;
          case 404:
            appError = new NotFoundError('The requested resource was not found');
            break;
          case 500:
            appError = new ApplicationError('An internal server error occurred');
            break;
          default:
            appError = new ApplicationError('A network error occurred');
        }

        this.errorHandler.handleError(appError);
        return throwError(() => appError);
      })
    );
  }
} 