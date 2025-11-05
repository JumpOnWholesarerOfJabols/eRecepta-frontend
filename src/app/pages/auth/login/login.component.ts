import { Component } from '@angular/core';
import { InputComponent } from "../../../components/input/input.component";
import { InputTypes } from '../../../utils/InputTypes';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";
import { LoginService } from '../../../services/loginService/login.service';
import { AuthService } from '../../../services/authService/auth.service';

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
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
    login: ['' /*[Validators.required*/], //pattern="^([0-9]{11}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$"
    password: ['' /*[Validators.required]*/],
    rememberMe: [false]
  });
  }

  login() {
    this.loginForm.markAllAsTouched();
    if(this.loginForm.valid) {
      const { rememberMe, ...loginData } = this.loginForm.getRawValue();
      console.log("logindata: ", loginData)
      this.loginService.login(loginData).subscribe({
        next: (value) => {
          console.log("logged");
          
          this.authService.setToken(rememberMe, value.token);
          
        },
        error: (err) => {
          console.log("blad przy logowaniu");
        }
      })
    } else {
      console.log("Blad danych")
    }
  }
}
