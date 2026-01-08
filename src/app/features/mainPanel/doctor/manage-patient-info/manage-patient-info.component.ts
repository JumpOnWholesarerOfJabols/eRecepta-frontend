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
import { BloodType, UpdatePatientInfoInput, PatientInfo } from '../../../../core/models/graphql-data.model';

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
  loadingInfo = false;
  busyAllergy = false;
  busyDisease = false;
  patientInfo: PatientInfo | null = null;

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
      emergencyContact: ['', Validators.required],
      newAllergy: [''],
      newDisease: ['']
    });
  }

  loadPatientInfo(): void {
    const userId = this.patientInfoForm.value.userId;
    if (!userId) {
      this.snackbar.openErrorSnackBar('Patient User ID is required');
      return;
    }
    this.loadingInfo = true;
    this.patientService.getPatientRecord(userId).subscribe({
      next: (result) => {
        const info = result.data?.getPatientRecordByUserId || null;
        this.patientInfo = info;
        if (info) {
          this.patientInfoForm.patchValue({
            bloodType: info.bloodType,
            height: info.height,
            weight: info.weight,
            emergencyContact: info.emergencyContact
          });
        }
        this.loadingInfo = false;
      },
      error: (error) => {
        console.error('Error loading patient info:', error);
        this.snackbar.openErrorSnackBar('Failed to load patient info');
        this.loadingInfo = false;
      }
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
    this.patientInfo = null;
  }

  addAllergy(): void {
    const userId = this.patientInfoForm.value.userId;
    const allergy = (this.patientInfoForm.value.newAllergy || '').trim();
    if (!userId || !allergy) {
      this.snackbar.openErrorSnackBar('Provide user ID and allergy');
      return;
    }
    this.busyAllergy = true;
    this.patientService.addAllergy(userId, allergy).subscribe({
      next: (result) => {
        const updated = result.data?.addAllergy || null;
        if (updated) {
          this.patientInfo = updated;
          this.patientInfoForm.patchValue({ newAllergy: '' });
          this.snackbar.openSnackBar('Allergy added');
        }
        this.busyAllergy = false;
      },
      error: (error) => {
        console.error('Error adding allergy:', error);
        this.snackbar.openErrorSnackBar('Failed to add allergy');
        this.busyAllergy = false;
      }
    });
  }

  removeAllergy(allergy: string): void {
    const userId = this.patientInfoForm.value.userId;
    if (!userId) {
      this.snackbar.openErrorSnackBar('Patient User ID is required');
      return;
    }
    this.busyAllergy = true;
    this.patientService.removeAllergy(userId, allergy).subscribe({
      next: (result) => {
        const updated = result.data?.removeAllergy || null;
        if (updated) {
          this.patientInfo = updated;
          this.snackbar.openSnackBar('Allergy removed');
        }
        this.busyAllergy = false;
      },
      error: (error) => {
        console.error('Error removing allergy:', error);
        this.snackbar.openErrorSnackBar('Failed to remove allergy');
        this.busyAllergy = false;
      }
    });
  }

  addDisease(): void {
    const userId = this.patientInfoForm.value.userId;
    const disease = (this.patientInfoForm.value.newDisease || '').trim();
    if (!userId || !disease) {
      this.snackbar.openErrorSnackBar('Provide user ID and disease');
      return;
    }
    this.busyDisease = true;
    this.patientService.addChronicDisease(userId, disease).subscribe({
      next: (result) => {
        const updated = result.data?.addChronicDisease || null;
        if (updated) {
          this.patientInfo = updated;
          this.patientInfoForm.patchValue({ newDisease: '' });
          this.snackbar.openSnackBar('Chronic disease added');
        }
        this.busyDisease = false;
      },
      error: (error) => {
        console.error('Error adding chronic disease:', error);
        this.snackbar.openErrorSnackBar('Failed to add chronic disease');
        this.busyDisease = false;
      }
    });
  }

  removeDisease(disease: string): void {
    const userId = this.patientInfoForm.value.userId;
    if (!userId) {
      this.snackbar.openErrorSnackBar('Patient User ID is required');
      return;
    }
    this.busyDisease = true;
    this.patientService.removeChronicDisease(userId, disease).subscribe({
      next: (result) => {
        const updated = result.data?.removeChronicDisease || null;
        if (updated) {
          this.patientInfo = updated;
          this.snackbar.openSnackBar('Chronic disease removed');
        }
        this.busyDisease = false;
      },
      error: (error) => {
        console.error('Error removing chronic disease:', error);
        this.snackbar.openErrorSnackBar('Failed to remove chronic disease');
        this.busyDisease = false;
      }
    });
  }
}
