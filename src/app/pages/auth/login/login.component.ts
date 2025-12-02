import { Component } from '@angular/core';
import { InputComponent } from "../../../components/input/input.component";
import { InputTypes } from '../../../utils/InputTypes';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { LoginService } from '../../../services/authServices/loginService/login.service';
import { AuthService } from '../../../services/authServices/authService/auth.service';
import { SnackbarService } from '../../../services/snackbarService/snackbar.service';

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
        next: (result) => {

        if (result.data) {
          this.authService.setToken(rememberMe, result.data.token);
          this.router.navigate(['main']);
        } else {
          this.loginForm.controls.password.setValue('');
        }
          
        },
        error: (err) => {
          
        }
      })
    } else {
      console.log("Blad danych")
    }
  }
}
