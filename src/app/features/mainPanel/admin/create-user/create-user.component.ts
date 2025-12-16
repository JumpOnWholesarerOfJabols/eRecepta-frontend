import { Component, OnInit, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AdminService } from '../../../../core/services/adminService/admin.service';
import { SnackbarService } from '../../../../core/services/snackbarService/snackbar.service';
import { Gender, Role } from '../../../../core/models/UserData';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { InputTypes } from '../../../../shared/utils/InputTypes';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ]
})
export class CreateUserComponent {
  createUserForm: FormGroup<{
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    email: FormControl<string>;
    dateOfBirth: FormControl<string>;
    pesel: FormControl<string>;
    phoneNumber: FormControl<string>;
    gender: FormControl<string>;
    role: FormControl<string>;
    password: FormControl<string>;

  }>;
  isLoading = false;
  readonly InputTypes = InputTypes;

  readonly genders = Object.values(Gender);
  readonly roles = Object.values(Role);

  readonly userCreatedEvent = output();

  constructor(
    private fb: NonNullableFormBuilder,
    private adminService: AdminService,
    private snackbar: SnackbarService
  ) {
    this.createUserForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
      pesel: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{9,12}$/)]],
      gender: ['', Validators.required],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.createUserForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formValue = this.createUserForm.value;

    this.adminService.createUser(formValue).subscribe({
      next: (result) => {
        this.isLoading = false;
        if (result.data?.createUser?.success) {
          this.snackbar.openSnackBar('User created successfully');
          this.userCreatedEvent.emit();

          this.createUserForm.reset();

          // WAŻNE – reset stanów walidacji
          this.createUserForm.markAsPristine();
          this.createUserForm.markAsUntouched();

          Object.values(this.createUserForm.controls).forEach(control => {
            control.setErrors(null);
          });
        } else {
          this.snackbar.openSnackBar(result.data?.createUser?.message!);
          console.log(result.data?.createUser?.message)
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error creating user:', err);
      }
    });
  }
}
