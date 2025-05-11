import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthStateService } from '@services/auth-state.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);
  const authToken = authStateService.authToken();
  const apiUrl = environment.API_URL;

  const isApiUrl = req.url.startsWith(apiUrl);

  let authReq = req;
  if (authToken && isApiUrl) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        authStateService.logout();
        router.navigate(['/auth']);
      }
      return throwError(() => error);
    })
  );
};
