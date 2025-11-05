import { Component } from '@angular/core';
import { InputComponent } from '../../../components/input/input.component';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { InputTypes } from '../../../utils/InputTypes';

@Component({
  selector: 'app-forgot-password',
  imports: [
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
  constructor(private fb: NonNullableFormBuilder) {
    this.resetForm = this.fb.group({
      login: ['', /** Validator.required */]
    });
  }

  reset() {
    //reset request
  }

}
