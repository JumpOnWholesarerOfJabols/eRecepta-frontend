import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PatientService } from '../../../../core/services/patientService/patient.service';
import { SnackbarService } from '../../../../core/services/snackbarService/snackbar.service';
import { BloodType, UpdatePatientInfoInput } from '../../../../core/models/graphql-data.model';

@Component({
  selector: 'app-manage-patient-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './manage-patient-info.component.html',
  styleUrls: ['./manage-patient-info.component.css']
})
export class ManagePatientInfoComponent implements OnInit {
  patientInfoForm!: FormGroup;
  loading = false;
  bloodTypes = Object.values(BloodType);

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private snackbar: SnackbarService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.patientInfoForm = this.fb.group({
      userId: ['', Validators.required],
      bloodType: ['', Validators.required],
      height: [null, [Validators.required, Validators.min(50), Validators.max(250)]],
      weight: [null, [Validators.required, Validators.min(20), Validators.max(300)]],
      emergencyContact: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.patientInfoForm.invalid) {
      this.snackbar.openErrorSnackBar('Please fill in all required fields correctly');
      return;
    }

    this.loading = true;
    const formValue = this.patientInfoForm.value;
    const userId = formValue.userId;

    const input: UpdatePatientInfoInput = {
      bloodType: formValue.bloodType,
      height: parseFloat(formValue.height),
      weight: parseFloat(formValue.weight),
      emergencyContact: formValue.emergencyContact
    };

    this.patientService.updatePatientInfo(userId, input).subscribe({
      next: (result) => {
        if (result.data?.updatePatientInfo) {
          this.snackbar.openSnackBar('Patient information updated successfully');
          this.patientInfoForm.reset();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error updating patient info:', error);
        this.snackbar.openErrorSnackBar('Failed to update patient information');
        this.loading = false;
      }
    });
  }

  onReset(): void {
    this.patientInfoForm.reset();
  }
}
