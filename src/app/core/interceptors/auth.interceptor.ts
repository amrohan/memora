// src/app/core/interceptors/auth.interceptor.ts
import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptorFn, // Use the functional interceptor type
  HttpRequest,
  HttpHandlerFn, // Use the functional handler type
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Adjust path
import { AuthStateService } from '@services/auth-state.service';

/**
 * Intercepts outgoing HTTP requests to add the Authorization Bearer token
 * if the user is authenticated and the request is going to the application's API URL.
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn // next is the handler function
): Observable<HttpEvent<any>> => {
  const authStateService = inject(AuthStateService); // Inject the service
  const authToken = authStateService.authToken(); // Get the current token value from the signal
  const apiUrl = environment.API_URL;

  // Check if the request URL starts with our API URL
  // This prevents sending the token to third-party APIs
  const isApiUrl = req.url.startsWith(apiUrl);

  // Check if a token exists and the request is targeting our API
  if (authToken && isApiUrl) {
    // Clone the request to add the new header. Requests are immutable.
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`, // Set the Authorization header
      },
      // Alternative using headers property:
      // headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });

    return next(authReq);
  } else {
    // If no token or not an API request, pass the original request without modification
    if (!authToken && isApiUrl) {
      console.log('Auth Interceptor: No token found for API request', req.url);
    }
    return next(req);
  }
};
