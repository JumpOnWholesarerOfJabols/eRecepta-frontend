import { Component } from '@angular/core';
import { InputComponent } from "../../../components/input/input.component";
import { InputTypes } from '../../../utils/InputTypes';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { RegisterService } from '../../../services/authServices/registerService/register.service';
import { Gender } from '../../../utils/UserData';
import { SnackbarService } from '../../../services/snackbarService/snackbar.service';
import { NgClass } from '@angular/common';

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


  constructor(
    private fb: NonNullableFormBuilder,
    private registerService: RegisterService,
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

    if (this.registerForm.valid) {
      const { acceptPolicy, ...newUserData } = this.registerForm.getRawValue();
      this.registerService.registerUser(newUserData).subscribe({
        next: (result) => {

        if (result.data) {
          this.snackBar.openSnackBar('Account created! Enter your verification code');
          this.router.navigate(['verifyAccount']);
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
