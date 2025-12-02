import { Component } from '@angular/core';
import { InputComponent } from '../../../components/input/input.component';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { InputTypes } from '../../../utils/InputTypes';
import { Router, RouterLink } from '@angular/router';
import { ForgotPasswordService } from '../../../services/authServices/forgotPasswordService/forgot-password.service';
import { SnackbarService } from '../../../services/snackbarService/snackbar.service';

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
  constructor(
    private fb: NonNullableFormBuilder,
    private forgotPasswordService: ForgotPasswordService,
    private snackBar: SnackbarService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      login: ['', Validators.required]
    });
  }

  reset() {
    if (this.resetForm.valid) {
      //Cannot be null because of Validator
      const login = this.resetForm.value.login!;
      this.forgotPasswordService.resetRequest(login).subscribe({
        next: (result) => {
          if(result.data) {
            this.router.navigate(
            ['setNewPassword', { queryParams: { login: login } }
            ])
          } else {
            // Apollo handler
          }
          
        },
        error: (err) => {
          this.snackBar.openSnackBar('Network error. Check your connection');
        },
      })
    }

  }

}
