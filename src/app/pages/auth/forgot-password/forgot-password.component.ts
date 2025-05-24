import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  email = '';
  isLoading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  onSubmit() {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.authService.forgotPassword(this.email)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          this.successMessage = response.message || 'If an account with that email exists, you will receive a password reset link shortly.';
          this.email = '';
        },
        error: (error) => {
          this.errorMessage = error.message || 'An error occurred while processing your request. Please try again.';
        }
      });
  }

  onBackToLogin() {
    this.router.navigate(['/auth']);
  }
}
