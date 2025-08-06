import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private requestCount = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requestCount++;
    this.loadingSubject.next(true);

    return next.handle(request).pipe(
      finalize(() => {
        this.requestCount--;
        if (this.requestCount === 0) {
          this.loadingSubject.next(false);
        }
      })
    );
  }
} 