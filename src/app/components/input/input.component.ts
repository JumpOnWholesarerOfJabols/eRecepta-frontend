import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTypes } from '../../utils/InputTypes';
import { FormControl } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-input',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIcon
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.css'
})
export class InputComponent {
  InputTypes = InputTypes;
  @Input() label = '';
  @Input() placeholder = '';
  @Input() type: InputTypes = InputTypes.TEXT;
  @Input({required: true}) control!: FormControl;
  @Input() selectValues: string[] = [];

  inputValue = '';
  showPassword = false;
}
