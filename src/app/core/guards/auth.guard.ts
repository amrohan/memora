import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from '@services/auth-state.service'; // Adjust path

export const authGuard: CanActivateFn = (route, state) => {
  const authStateService = inject(AuthStateService);
  const router = inject(Router);

  if (authStateService.isAuthenticated()) {
    return true; // User is authenticated, allow access
  } else {
    // User is not authenticated, redirect to login page
    console.log('AuthGuard: User not authenticated, redirecting to /auth');
    // Store the attempted URL to redirect back after login (optional)
    router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
    return false; // Prevent access
  }
};
