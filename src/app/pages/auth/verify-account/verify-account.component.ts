import { Component } from '@angular/core';
import { InputTypes } from '../../../utils/InputTypes';
import { RegisterService } from '../../../services/authServices/registerService/register.service';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '../../../components/input/input.component';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SnackbarService } from '../../../services/snackbarService/snackbar.service';

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

  constructor(
    private registerService: RegisterService,
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
    this.activatedRoute.queryParams.subscribe(params => {
      const login = params['login']
      if (login) {
        this.verifyForm.patchValue({ login: login })
      }
    })
  }

  verify() {
    if (this.verifyForm.valid) {
      this.registerService.verifyUser(this.verifyForm.getRawValue()).subscribe({
        next: (result) => {
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

}
