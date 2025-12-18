import { Component } from '@angular/core';
import { Specialization } from '../../../../core/models/graphql-data.model';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTypes } from '../../../../shared/utils/InputTypes';
import { PatientService } from '../../../../core/services/patientService/patient.service';
import { CreateVisitInput } from '../../../../core/models/graphql-data.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DayOfWeek, WeeklyAvailability } from '../../../../core/models/ResponseData';
import { MatButton } from "@angular/material/button";
import { visit } from 'graphql';
import { SnackbarService } from '../../../../core/services/snackbarService/snackbar.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { formatDate } from '../../../../shared/utils/dateFormatter';

interface AppointmentForm {
  specialization: FormControl<Specialization>;
  doctor: FormControl<string>;
  date: FormControl<Date>;
  time: FormControl<string>;
}

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatButton, 
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent {
  appointmentForm: FormGroup<AppointmentForm>;
  specializations = Object.values(Specialization);
  doctors: string[] = [];
  availability: WeeklyAvailability[] = [];

  chosenDate!: Date;
  readonly INPUT_TYPES = InputTypes;
  readonly DAY_OF_WEEK = Object.values(DayOfWeek);
  loading = false;

  constructor(
    fb: NonNullableFormBuilder, 
    private patientService: PatientService,
    private snackbar: SnackbarService
  ) {
    this.appointmentForm = fb.group({
      specialization: ['' as unknown as Specialization, { nonNullable: true, validators: Validators.required }],
      doctor: ['', { nonNullable: true, validators: Validators.required }],
      date: ['' as unknown as Date, { nonNullable: true, validators: Validators.required }],
      time: ['', { nonNullable: true, validators: Validators.required }]

    })
  }

  onSpecializationChange() {
    this.loading = true;
    this.appointmentForm.patchValue({ doctor: '', date: undefined, time: '' });
    this.doctors = [];
    this.availability = [];
    this.getDoctorsBySpecialization(this.appointmentForm.controls.specialization.value);
  }

  onDoctorChange() {
    this.loading = true;
    this.appointmentForm.patchValue({ date: undefined, time: '' });
    this.availability = [];
    this.getAvailabilityByDoctorId(this.appointmentForm.controls.doctor.value);
  }
  
  onDayChange(event: any) {
    this.chosenDate = event.value;
    this.appointmentForm.patchValue({ time: '' });
  }

  onTimeChange() {

  }

  confirmAppointment() {
    if(!this.appointmentForm.valid) {
      return;
    }

    const time = this.appointmentForm.controls.time.value;
    const dateFormatted = formatDate(this.chosenDate)

    let visitData: CreateVisitInput = {
      doctorId: this.appointmentForm.controls.doctor.value,
      specialization: this.appointmentForm.controls.specialization.value,
      visitTime: dateFormatted + time
    }

    this.patientService.createVisit(visitData).subscribe({
      next: (value) => {
        if(value.data?.createVisit) {
          console.log("wiztya!" + value.data);
          this.snackbar.openSnackBar('Appointment made successfully')
          this.appointmentForm.reset();
          this.appointmentForm.markAsPristine();
          Object.values(this.appointmentForm.controls).forEach(control => {
            control.setErrors(null);
          });
        }
        
      },
    })


  }

  getDoctorsBySpecialization(specialization: string) {
    this.patientService.findAllDoctors(specialization).subscribe({
      next: (value) => {
        this.doctors = value.data?.findAllDoctors ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    })
  }

  getAvailabilityByDoctorId(doctorId: string) {
    this.patientService.findAllWeeklyAvailabilities(doctorId).subscribe({
      next: (result) => {
        this.loading = false;
        this.availability = [];
        result.data?.findAllWeeklyAvailabilities.map(v => {
          this.availability.push(v);
        })
      },
      error: (err) => {
        this.loading = false;
      },
    })
  }

  get hoursAvailability() {
    if(!this.chosenDate) {
      return [];
    }

    const dayOfWeek = this.DAY_OF_WEEK.at(this.chosenDate.getDay());
    const availability = this.availability.find(a => a.dayOfWeek === dayOfWeek)

    if (!availability) {
      return [];
    }

    return this.generateSlots(availability.startTime, availability.endTime);
  }

  private generateSlots(startTime: string, endTime: string, stepMin: number = 20) {
    let slots = [];

    let current = this.timeToMinutes(startTime);
    let end = this.timeToMinutes(endTime);

    while(current < end) {
      slots.push(this.minutesToTime(current));
      current += stepMin;
    }

    return slots;

  }

  private timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  private minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = Math.floor((minutes % 60)).toString().padStart(2, '0');

    return `${h}:${m}`;
  }

}
