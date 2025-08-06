import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the auth token from a service
  const authToken = 'YOUR_AUTH_TOKEN'; // Replace with your logic

  // Clone the request and add the authorization header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`
    }
  });

  // Pass the cloned request instead of the original request to the next handler
  return next(authReq);
};
