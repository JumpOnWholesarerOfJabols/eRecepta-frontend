import { Component } from '@angular/core';
import { InputComponent } from "../../../components/input/input.component";
import { InputTypes } from '../../../utils/InputTypes';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { RegisterService } from '../../../services/authServices/registerService/register.service';
import { Gender, UserData } from '../../../utils/UserData';
import { SnackbarService } from '../../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-register',
  imports: [
    InputComponent,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    RouterLink,
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
    private router : Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['' , [Validators.required, Validators.minLength(2)]],
      lastName: ['' , [Validators.required, Validators.minLength(2)]],
      email: ['' , [Validators.required, Validators.email]],
      password: ['' , [Validators.required, Validators.minLength(8)]],
      pesel: ['' , [Validators.required, Validators.pattern(/^\d{11}$/)]],
      phoneNumber: ['' , [Validators.required, Validators.pattern(/^\d{9,15}$/)]],
      gender: [null , Validators.required],
      dateOfBirth: ['' , Validators.required],
      acceptPolicy: [false , Validators.requiredTrue]
    });

  }

  register() {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      const {acceptPolicy, ...newUserData} = this.registerForm.getRawValue();
      console.log('raw: ', JSON.stringify(newUserData));
      this.registerService.registerUser(newUserData).subscribe({
        next: (value) => {
          this.snackBar.openSnackBar('Registration successful!');
          this.registerService.sendVerificationCode(newUserData.email).subscribe({
            next: (value) => {
              this.snackBar.openSnackBar('We sent you a verification code on your email!');
              this.router.navigate(['verifyAccount']);
            },
            error: (err) => {
              this.snackBar.openSnackBar(err.message);
            }
          })
        },
        error: (err) => {
          this.snackBar.openSnackBar('Error while signing up. Try again later');
          console.log(err);
        },
      })
    } else {
      this.snackBar.openSnackBar('You data is invalid!');
    }
  }

  
}
