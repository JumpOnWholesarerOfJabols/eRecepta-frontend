import { Component } from '@angular/core';
import { InputComponent } from "../../../components/input/input.component";
import { InputTypes } from '../../../utils/InputTypes';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { RegisterService } from '../../../services/registerService/register.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserData } from '../../../utils/UserData';

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
  genderSelect = ['Male', 'Female'];
  registerForm;


  constructor(
    private fb: NonNullableFormBuilder,
    private registerService: RegisterService,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['' /*, [Validators.required, Validators.minLength(2)]*/],
      surname: ['' /*, [Validators.required, Validators.minLength(2)]*/],
      email: ['' /*, [Validators.required, Validators.email]*/],
      password: ['' /*, [Validators.required, Validators.minLength(6)]*/],
      pesel: ['' /*, [Validators.required, Validators.pattern(/^\d{11}$/)]*/],
      phoneNumber: ['' /*, [Validators.required, Validators.pattern(/^\d{9,15}$/)]*/],
      gender: ['' /*, Validators.required*/],
      birthday: ['' /*, Validators.required*/],
      acceptPolicy: [false /*, Validators.requiredTrue*/]
    });

  }

  register() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      const newUserData: UserData = this.registerForm.getRawValue();
      console.log('raw: ', newUserData);
      this.registerService.registerUser(newUserData).subscribe({
        next: (value) => {
          console.log(value);
          this.openSnackBar('Registration successful!', 'Close');
        },
        error: (err) => {
          this.openSnackBar('Registration failder! Try again later', 'Close');
          console.log(err);
        },
      })
    } else {
      this.openSnackBar('You data is invalid!', 'Close');
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
