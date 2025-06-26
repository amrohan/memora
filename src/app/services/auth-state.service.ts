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

  #currentUser: WritableSignal<AuthUser | null> = signal(null);
  #authToken: WritableSignal<string | null> = signal(null);

  readonly currentUser: Signal<AuthUser | null> =
    this.#currentUser.asReadonly();
  readonly authToken: Signal<string | null> = this.#authToken.asReadonly();

  readonly isAuthenticated = computed(() => !!this.#authToken());

  private _initialized = this.loadInitialAuthState();

  /** Loads initial state from localStorage when the service is created */
  private loadInitialAuthState(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const storedUserJson = localStorage.getItem(AUTH_USER_KEY);

      if (storedToken && storedUserJson) {
        try {
          const storedUser = JSON.parse(storedUserJson) as AuthUser;
          this.#authToken.set(storedToken);
          this.#currentUser.set(storedUser);
        } catch (error) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(AUTH_USER_KEY);
          this.#authToken.set(null);
          this.#currentUser.set(null);
        }
      } else {
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
    this.persistAuthState();
  }

  /** Clears the authentication state and manually updates storage */
  clearAuthState(): void {
    this.#authToken.set(null);
    this.#currentUser.set(null);
    this.persistAuthState();
  }

  /** Logs the user out, clears state, updates storage, and navigates to login */
  logout(): void {
    this.clearAuthState();
    this.router.navigate(['/auth']);
  }
}
