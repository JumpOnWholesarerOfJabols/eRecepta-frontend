import { Component, DestroyRef, inject } from '@angular/core';
import { InputComponent } from '../../../shared/components/input/input.component';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { InputTypes } from '../../../shared/utils/InputTypes';
import { Router, RouterLink } from '@angular/router';
import { SnackbarService } from '../../../core/services/snackbarService/snackbar.service';
import { AuthApiService } from '../../../core/auth/services/authApi/auth-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-forgot-password',
  imports: [
    RouterLink,
    InputComponent,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  InputTypes = InputTypes;
  resetForm;
  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: NonNullableFormBuilder,
    private authApiService: AuthApiService,
    private snackBar: SnackbarService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      login: ['', Validators.required]
    });
  }

  reset() {
    if (this.resetForm.valid) {
      const login = this.resetForm.value.login ?? '';
      this.authApiService.sendResetPasswordRequest(login)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (result) => {
            if (result.data) {
              this.router.navigate(
                ['setNewPassword', { queryParams: { login: login } }])
            } else {

            }
          },
          error: (err) => {
            this.snackBar.openSnackBar('Network error. Check your connection');
          },
        })
    }

  }

}
