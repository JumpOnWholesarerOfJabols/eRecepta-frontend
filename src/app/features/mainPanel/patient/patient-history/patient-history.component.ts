import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { PatientService } from '../../../../core/services/patientService/patient.service';
import { SnackbarService } from '../../../../core/services/snackbarService/snackbar.service';
import { PatientHistoryEntry, RevisionType, BloodType, PatientInfo } from '../../../../core/models/graphql-data.model';
import { AuthService } from '../../../../core/auth/services/authService/auth.service';

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule]
})
export class PatientHistoryComponent implements OnInit {
  patientInfo: PatientInfo | null = null;
  loading: boolean = false;
  REVISION_TYPE = RevisionType;
  BLOOD_TYPE = BloodType;

  constructor(
    private patientService: PatientService,
    private snackBar: SnackbarService,
    private authService: AuthService
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
  }


  
}
