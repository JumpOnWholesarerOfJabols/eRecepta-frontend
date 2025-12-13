import { Component, DestroyRef, inject } from '@angular/core';
import { InputComponent } from "../../../shared/components/input/input.component";
import { InputTypes } from '../../../shared/utils/InputTypes';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthApiService } from '../../../core/auth/services/authApi/auth-api.service';
import { Gender } from '../../../core/auth/models/UserData';
import { SnackbarService } from '../../../core/services/snackbarService/snackbar.service';
import { NgClass } from '@angular/common';
import { pipe } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  imports: [
    InputComponent,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    RouterLink,
    NgClass,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  InputTypes = InputTypes;
  genderSelect = [Gender.MALE, Gender.FEMALE];
  registerForm;
  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: NonNullableFormBuilder,
    private authApiService: AuthApiService,
    private snackBar: SnackbarService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      pesel: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{9,15}$/)]],
      gender: [null, Validators.required],
      dateOfBirth: ['', Validators.required],
      acceptPolicy: [false, Validators.requiredTrue]
    });

  }

  register() {
    this.registerForm.markAllAsTouched();
console.log(this.registerForm.valid)
    if (this.registerForm.valid) {
      console.log("valid xd")
      const { acceptPolicy, ...newUserData } = this.registerForm.getRawValue();
      this.authApiService.registerUser(newUserData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          console.log(result);

        if (result.data) {
          this.snackBar.openSnackBar('Account created! Enter your verification code');

          this.router.navigate(['verifyAccount'], { queryParams: { login: newUserData.email }});
        } else {
          //handler
        }

        },
        error: (err) => {
          this.snackBar.openErrorSnackBar('Error while signing up. Try again later');
          console.log(err);
        },
      })
    }
  }


}
