import { Component, DestroyRef, inject } from '@angular/core';
import { InputTypes } from '../../../shared/utils/InputTypes';
import { AuthApiService } from '../../../core/auth/services/authApi/auth-api.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../shared/components/input/input.component';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SnackbarService } from '../../../core/services/snackbarService/snackbar.service';
import { VerificationData } from '../../../core/auth/models/CredentialsData';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-verify-account',
  imports: [
    InputComponent,
    MatButtonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './verify-account.component.html',
  styleUrl: './verify-account.component.css'
})
export class VerifyAccountComponent {
  InputTypes = InputTypes;
  verifyForm;
  private destroyRef = inject(DestroyRef);

  constructor(
    private authApiService: AuthApiService,
    private fb: NonNullableFormBuilder,
    private snackBar: SnackbarService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.verifyForm = this.fb.group({
      login: ['', Validators.required],
      code: ['', Validators.required]
    })
  }

  ngOnInit() {
    this.activatedRoute.queryParams
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(params => {
      const login = params['login']
      if (login) {
        this.verifyForm.patchValue({ login: login })
      }
    })
  }

  verify() {
    if (this.verifyForm.valid) {
      let verData: VerificationData = this.verifyForm.getRawValue();
      verData.code = verData.code.toUpperCase();
      this.authApiService.verifyUser(verData)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          console.log(result.error)
          if(result.data) {
            this.snackBar.openSnackBar('Account verified!');
            this.router.navigate([''])
          } else {
            //handler
          }
        },
        error: (err) => {
          console.log(err)
          this.snackBar.openSnackBar('Failed to verify your account');

        }
      })
    }
  }

  sendVerificationCodeAgain() {
    if (this.verifyForm.value.login !== '') {
      this.authApiService.sendVerificationCode(this.verifyForm.value.login!).subscribe({
        next: (result) => {
          if(result.data) {
            this.snackBar.openSnackBar("Your code has been sent again!")
          }
        },
        error: (err) => {
          this.snackBar.openErrorSnackBar("Con error!")
        }
      })
    }
    
  }

}
