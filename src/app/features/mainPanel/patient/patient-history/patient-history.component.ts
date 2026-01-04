import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { PatientService } from '../../../../core/services/patientService/patient.service';
import { SnackbarService } from '../../../../core/services/snackbarService/snackbar.service';
import { PatientHistoryEntry, RevisionType, BloodType, PatientInfo, PrescriptionStatus } from '../../../../core/models/graphql-data.model';
import { AuthService } from '../../../../core/auth/services/authService/auth.service';
import { PrescriptionService } from '../../../../core/services/prescriptionService/prescription.service';
import { finalize, forkJoin } from 'rxjs';
import { Prescription } from '../../../../core/models/graphql-data.model';

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule]
})
export class PatientHistoryComponent implements OnInit {
  patientInfo: PatientInfo | null = null;
  patientPrescritpions: Prescription[] = [];
  loading: boolean = false;
  REVISION_TYPE = RevisionType;
  BLOOD_TYPE = BloodType;
  PRESCRIPTION_STATUS = PrescriptionStatus;

  constructor(
    private patientService: PatientService,
    private snackBar: SnackbarService,
    private authService: AuthService,
    private prescriptionService: PrescriptionService
  ) { }

  ngOnInit(): void {
    this.loadPatientHistory();
  }

  loadPatientHistory(): void {
    this.loading = true;
    const userId = this.authService.getUserId() ?? '';


    this.patientService.getPatientRecord(userId).subscribe({
      next: (result) => {
            console.log("idd:" + result.data?.getPatientRecordByUserId)
        if (result.data?.getPatientRecordByUserId) {
          this.patientInfo = result.data.getPatientRecordByUserId;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patient history:', error);
        this.loading = false;
      }
    });

    forkJoin({
      record: this.patientService.getPatientRecord(userId),
      prescription: this.prescriptionService.getPrescriptions(this.authService.getUserId() ?? '')
    }).pipe(
      finalize(() => this.loading = false)
    )
    .subscribe({
      next: (value) => {
        if(value.prescription.data?.prescriptions && value.record.data?.getPatientRecordByUserId) {
          this.patientInfo = value.record.data.getPatientRecordByUserId;
          this.patientPrescritpions = value.prescription.data?.prescriptions
        }
      },
      error: (err) => {
        this.snackBar.openErrorSnackBar('unknown error')
      }
    })
  }

}
