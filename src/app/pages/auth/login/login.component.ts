import { Component } from '@angular/core';
import { InputComponent } from "../../../components/input/input.component";
import { InputTypes } from '../../../utils/InputTypes';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { LoginService } from '../../../services/authServices/loginService/login.service';
import { AuthService } from '../../../services/authServices/authService/auth.service';
import { SnackbarService } from '../../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-login',
  imports: [
    InputComponent,
    MatButtonModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    RouterLink
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  InputTypes = InputTypes;
  loginForm;

  constructor(
    private loginService: LoginService,
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private snackBar: SnackbarService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
    login: ['', Validators.required], //pattern="^([0-9]{11}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$"
    password: ['', [Validators.required]],
    rememberMe: [false]
  });
  }

  login() {
    this.loginForm.markAllAsTouched();

    if(this.loginForm.valid) {
      const { rememberMe, ...loginData } = this.loginForm.getRawValue();
      this.loginService.login(loginData).subscribe({
        next: (value) => {
          console.log("logged : ", value);

          this.authService.setToken(rememberMe, value.token);
          this.router.navigate(['main'])
          
        },
        error: (err) => {
          console.log("blad przy logowaniu", err.message);
          this.snackBar.openSnackBar('Error while logging in', 5000);

          if(err.errors[0].extensions.errorCode === 'AccountVerificationException') {
            this.router.navigate(
              ['verifyAccount'], 
              {queryParams: {login: loginData.login}}
            )
          }
        }
      })
    } else {
      console.log("Blad danych")
    }
  }
}
