import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../../components/input/input.component';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { InputTypes } from '../../../utils/InputTypes';
import { ForgotPasswordService } from '../../../services/authServices/forgotPassword/forgot-password.service';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '../../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-set-new-password',
  imports: [
    RouterLink,
    InputComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './set-new-password.component.html',
  styleUrl: './set-new-password.component.css'
})
export class SetNewPasswordComponent {
  InputTypes = InputTypes;
  setForm;

  constructor(
    private fb: NonNullableFormBuilder,
    private forgotPasswordService: ForgotPasswordService,
    private acitvatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: SnackbarService
  ) {
    this.setForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      code: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.acitvatedRoute.queryParams.subscribe(params => {
      const login = params['login']
      if (login) {
        this.setForm.patchValue({ login: login });
      }
    })
  }

  set() {
    if (this.setForm.valid) {
      this.forgotPasswordService.reset(this.setForm.getRawValue()).subscribe({
        next: (value) => {
          this.snackBar.openSnackBar(value);
          this.router.navigate([''])
        },
        error: (err) => {
          console.log(err)
          this.snackBar.openSnackBar('Failed to set new password');
        }
      })
    }

  }

}
