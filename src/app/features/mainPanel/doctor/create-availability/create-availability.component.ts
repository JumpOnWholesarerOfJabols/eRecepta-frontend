import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DoctorService } from '../../../../core/services/doctorService/doctor.service';
import { DayOfWeek } from '../../../../core/models/ResponseData';
import { CreateWeeklyAvailabilityInput } from '../../../../core/models/graphql-data.model';
import { SnackbarService } from '../../../../core/services/snackbarService/snackbar.service';

interface AvailabilityForm {
  dayOfWeek: FormControl<DayOfWeek | null>;
  startTime: FormControl<string>;
  endTime: FormControl<string>;
}

@Component({
  selector: 'app-create-availability',
  standalone: true,
  templateUrl: './create-availability.component.html',
  styleUrl: './create-availability.component.css',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule]
})
export class CreateAvailabilityComponent {
  availabilityForm: FormGroup<AvailabilityForm>;
  readonly DAYS = Object.values(DayOfWeek).filter((v) => isNaN(Number(v)));
  loading = false;
  readonly updateAvailabilityEvent = output();

  constructor(
    fb: FormBuilder,
    private doctorService: DoctorService,
    private snackbar: SnackbarService
  ) {
    this.availabilityForm = fb.group({
      dayOfWeek: [null, { nonNullable: true, validators: Validators.required }],
      startTime: ['', { nonNullable: true, validators: Validators.required }],
      endTime: ['', { nonNullable: true, validators: Validators.required }],
    }) as FormGroup<AvailabilityForm>;;
  }

  submit() {
    if (!this.availabilityForm.valid) {
      return;
    }

    const { dayOfWeek, startTime, endTime } = this.availabilityForm.getRawValue();

    if (startTime >= endTime) {
      this.snackbar.openErrorSnackBar('End time must be after start time');
      return;
    }

    const payload: CreateWeeklyAvailabilityInput = {
      dayOfWeek: dayOfWeek!,
      startTime,
      endTime,
    };

    this.loading = true;
    this.doctorService.createWeeklyAvailability(payload).subscribe({
      next: (result) => {
        this.loading = false;
        if (result.data?.createWeeklyAvailability) {
          this.snackbar.openSnackBar('Availability added');
          this.availabilityForm.reset({ dayOfWeek: null, startTime: '', endTime: '' });
          Object.values(this.availabilityForm.controls).forEach(control => {
            control.setErrors(null);
          })
          this.updateAvailabilityEvent.emit();
        } 
      },
      error: () => {
        this.loading = false;
    
      },
    });
  }
}
