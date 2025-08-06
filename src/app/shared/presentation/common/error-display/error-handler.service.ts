import { ErrorHandler, Injectable, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApplicationException, DomainException } from '../../../domain/exceptions';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  private readonly message = inject(NzMessageService);

  handleError(error: any): void {
    console.error('Global error caught', error);

    if (error instanceof DomainException) {
      this.message.error(`[Domain Error] ${error.message}`);
    } else if (error instanceof ApplicationException) {
      this.message.error(`[Application Error] ${error.message}`);
    } else {
      this.message.error('An unknown error occurred. Please contact support.');
    }
  }
}
