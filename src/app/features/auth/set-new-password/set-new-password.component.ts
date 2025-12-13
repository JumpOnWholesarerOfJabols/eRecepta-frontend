import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { InputTypes } from '../../../shared/utils/InputTypes';
import { AuthApiService } from '../../../core/auth/services/authApi/auth-api.service';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '../../../core/services/snackbarService/snackbar.service';
import { pipe } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: NonNullableFormBuilder,
    private authApiService: AuthApiService,
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
    this.acitvatedRoute.queryParams
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(params => {
      const login = params['login']
      if (login) {
        this.setForm.patchValue({ login: login });
      }
    })
  }

  set() {
    if (this.setForm.valid) {
      this.authApiService.resetPassword(this.setForm.getRawValue()).subscribe({
        next: (result) => {
          if (result.data) {
            this.snackBar.openSnackBar('New password set!');
            this.router.navigate([''])
          } else {
            //handler
          }

        },
        error: (err) => {
          console.log(err)
          this.snackBar.openErrorSnackBar('Failed to set new password');
        }
      })
    }

  }

}
