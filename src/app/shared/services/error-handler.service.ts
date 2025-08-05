import { ErrorHandler, Injectable, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BaseError } from '../../domain/errors/custom-errors';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  private readonly message = inject(NzMessageService);

  handleError(error: any): void {
    console.error('Global error caught', error);

    if (error && typeof error === 'object' && 'code' in error) {
      this.handleKnownError(error as BaseError);
    } else {
      this.handleUnknownError(error);
    }
  }

  private handleKnownError(error: BaseError): void {
    switch (error.code) {
      case 'VALIDATION_ERROR':
        this.message.error(error.message);
        break;
      case 'NOT_FOUND':
        this.message.warning(error.message);
        break;
      default:
        this.message.error('An unexpected error occurred. Please try again later.');
    }
  }

  private handleUnknownError(error: any): void {
    this.message.error('An unknown error occurred. Please contact support.');
  }
} 