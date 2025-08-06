import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
// Create a loading service to handle loading state
// import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // const loadingService = inject(LoadingService);
  // loadingService.show();
  return next(req).pipe(
    finalize(() => {
      // loadingService.hide()
    })
  );
};
