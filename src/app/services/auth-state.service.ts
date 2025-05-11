import {
  Injectable,
  signal,
  computed,
  WritableSignal,
  Signal,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthUser } from '@models/user';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private router = inject(Router);

  // --- Signals ---
  // Private writable signals to hold the raw state
  #currentUser: WritableSignal<AuthUser | null> = signal(null);
  #authToken: WritableSignal<string | null> = signal(null);

  // Public readonly signals derived from the private ones
  readonly currentUser: Signal<AuthUser | null> =
    this.#currentUser.asReadonly();
  readonly authToken: Signal<string | null> = this.#authToken.asReadonly();

  // Computed signal for easy checking of authentication status
  readonly isAuthenticated = computed(() => !!this.#authToken());

  // --- Initialization (called once when the service is created) ---
  // We call the loading function directly here instead of in the constructor.
  // This code runs when the service instance is first created.
  private _initialized = this.loadInitialAuthState();

  /** Loads initial state from localStorage when the service is created */
  private loadInitialAuthState(): boolean {
    // Return value isn't crucial, just indicates completion
    // Check if running in a browser environment before accessing localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedUserJson = localStorage.getItem(AUTH_USER_KEY);

      if (storedToken && storedUserJson) {
        try {
          const storedUser = JSON.parse(storedUserJson) as AuthUser;
          // You might add token validation/expiry check here in a real app
          this.#authToken.set(storedToken);
          this.#currentUser.set(storedUser);
        } catch (error) {
          // Clear potentially corrupted storage
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(AUTH_USER_KEY);
          // Ensure signals are also null if parsing failed
          this.#authToken.set(null);
          this.#currentUser.set(null);
        }
      } else {
        // Ensure signals are null if nothing is found in storage
        this.#authToken.set(null);
        this.#currentUser.set(null);
      }
    } else {
      alert(
        'LocalStorage is not available. Auth state persistence is disabled.',
      );
      this.#authToken.set(null);
      this.#currentUser.set(null);
    }
    return true;
  }

  /** Manually persists the current auth state to localStorage */
  private persistAuthState(): void {
    // Check if running in a browser environment before accessing localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = this.#authToken();
      const user = this.#currentUser();

      if (token && user) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
  }

  /** Sets the current user and token, and manually persists them */
  setAuthState(user: AuthUser, token: string): void {
    this.#authToken.set(token);
    this.#currentUser.set(user);
    this.persistAuthState(); // Manually trigger persistence
  }

  /** Clears the authentication state and manually updates storage */
  clearAuthState(): void {
    this.#authToken.set(null);
    this.#currentUser.set(null);
    this.persistAuthState(); // Manually trigger persistence (to remove items)
  }

  /** Logs the user out, clears state, updates storage, and navigates to login */
  logout(): void {
    this.clearAuthState(); // This will now clear signals and call persistAuthState
    this.router.navigate(['/auth']); // Navigate to your login/auth route
  }
}
