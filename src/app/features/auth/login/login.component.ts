import { Component, DestroyRef, inject } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { InputTypes } from '../../../shared/utils/InputTypes';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../core/auth/services/authService/auth.service';
import { SnackbarService } from '../../../core/services/snackbarService/snackbar.service';
import { AuthApiService } from '../../../core/auth/services/authApi/auth-api.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [
    InputComponent,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  InputTypes = InputTypes;
  loginForm;
  private destroyRef = inject(DestroyRef);

  constructor(
    private authApiService: AuthApiService,
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private snackBar: SnackbarService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required], //pattern="^([0-9]{11}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$"
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  login() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.valid) {
      const { rememberMe, ...loginData } = this.loginForm.getRawValue();
      this.authApiService.login(loginData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (result) => {
            if (result.data) {
              this.authService.setToken(rememberMe, result.data.login.token);
              this.router.navigate(['main']);
            } else {
              if (result.error?.message === 'Account is not verified') {

                // Tutaj logika specyficzna dla komponentu:
                this.loginForm.controls.password.setValue('');

                // Opcjonalnie: możesz przekazać login/email w query params, 
                // żeby użytkownik nie musiał wpisywać go ponownie na stronie weryfikacji
                this.router.navigate(['verifyAccount'], {
                  queryParams: { login: loginData.login }
                });

                return;
              }
            } 
            this.loginForm.controls.password.setValue('');

          },
          error: (err) => {

          }
        })
    } else {
      console.log("Blad danych")
    }
  }
}
