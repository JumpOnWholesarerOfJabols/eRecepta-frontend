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
import { finalize, forkJoin, of } from 'rxjs';
import { Prescription } from '../../../../core/models/graphql-data.model';
import { MedicationService } from '../../../../core/services/medicationService/medication.service';
import { map, switchMap } from 'rxjs/operators';

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
    private prescriptionService: PrescriptionService,
    private medicationService: MedicationService
  ) { }

  ngOnInit(): void {
    this.loadPatientHistory();
  }

  loadPatientHistory(): void {
    this.loading = true;
    const userId = this.authService.getUserId() ?? '';

    const record$ = this.patientService
      .getPatientRecord(userId)
      .pipe(map(res => res.data?.getPatientRecordByUserId ?? null));

    const prescriptions$ = this.prescriptionService.getPrescriptions(userId);

    forkJoin({ record: record$, prescriptions: prescriptions$ })
      .pipe(
        switchMap(({ record, prescriptions }) => {
          if (record && Array.isArray(record.medications) && record.medications.length) {
            return forkJoin(
              record.medications.map(id =>
                this.medicationService
                  .medication(id)
                  .pipe(map(res => res.data?.medication?.tradeName ?? id))
              )
            ).pipe(
              map(names => ({ record: { ...record, medications: names }, prescriptions }))
            );
          }
          return of({ record, prescriptions });
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe({
        next: ({ record, prescriptions }) => {
          if (record) {
            this.patientInfo = record;
          }
          this.patientPrescritpions = prescriptions.data?.prescriptions ?? [];
        },
        error: () => this.snackBar.openErrorSnackBar('unknown error'),
      });
  }

}
