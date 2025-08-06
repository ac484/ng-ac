import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalErrorHandler } from 'src/app/shared/presentation/common/error-display/error-handler.service';
import { ApplicationException, ValidationError, NotFoundError, InternalServerErrorException, NetworkErrorException } from '../../domain/exceptions';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorHandler = inject(GlobalErrorHandler);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let appError: ApplicationException;

      switch (error.status) {
        case 400:
          appError = new ValidationError(error.error?.message || 'Invalid request parameters');
          break;
        case 404:
          appError = new NotFoundError('The requested resource was not found');
          break;
        case 500:
          appError = new InternalServerErrorException('An internal server error occurred');
          break;
        default:
          appError = new NetworkErrorException('A network error occurred');
      }

      errorHandler.handleError(appError);
      return throwError(() => appError);
    })
  );
};
