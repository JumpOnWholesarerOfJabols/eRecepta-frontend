import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrescriptionService } from '../../../../core/services/prescriptionService/prescription.service';
import { MedicationService } from '../../../../core/services/medicationService/medication.service';
import { SnackbarService } from '../../../../core/services/snackbarService/snackbar.service';
import { Prescription, PrescriptionStatus } from '../../../../core/models/graphql-data.model';
import { PrescriptionDetailsComponent } from '../prescription-details/prescription-details.component';

@Component({
  selector: 'app-prescription-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './prescription-list.component.html',
  styleUrl: './prescription-list.component.css',
})
export class PrescriptionListComponent implements OnInit {
  prescriptions: Prescription[] = [];
  displayedColumns: string[] = [
    'id',
    'patientId',
    'status',
    'totalPackages',
    'remainingPackages',
    'createdAt',
    'expiresAt',
    'actions',
  ];
  filterForm!: FormGroup;
  isLoading = false;

  statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: PrescriptionStatus.ISSUED, label: 'Issued' },
    { value: PrescriptionStatus.PARTIALLY_FILLED, label: 'Partially Filled' },
    { value: PrescriptionStatus.FILLED, label: 'Filled' },
    { value: PrescriptionStatus.CANCELLED, label: 'Cancelled' },
    { value: PrescriptionStatus.EXPIRED, label: 'Expired' },
  ];

  constructor(
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initFilterForm();
  }

  initFilterForm(): void {
    this.filterForm = this.fb.group({
      patientId: [''],
      status: [''],
    });
  }

  onSearch(): void {
    const { patientId, status } = this.filterForm.value;

    if (!patientId) {
      this.snackbarService.openErrorSnackBar('Please enter a patient ID');
      return;
    }

    this.isLoading = true;
    this.prescriptionService
      .getPrescriptions(patientId, status || undefined)
      .subscribe({
        next: (result) => {
          this.isLoading = false;
          if (result.data?.prescriptions) {
            this.prescriptions = result.data.prescriptions
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.snackbarService.openErrorSnackBar('Failed to load prescriptions');
          console.error('Error loading prescriptions:', error);
        },
      });
  }

  onReset(): void {
    this.filterForm.reset({
      patientId: '',
      status: '',
    });
    this.prescriptions = [];
  }

  viewDetails(prescription: Prescription): void {
    this.dialog.open(PrescriptionDetailsComponent, {
      width: '600px',
      data: prescription,
      height: '600px'
    });
  }

  getStatusColor(status: PrescriptionStatus): string {
    switch (status) {
      case PrescriptionStatus.ISSUED:
        return 'primary';
      case PrescriptionStatus.PARTIALLY_FILLED:
        return 'accent';
      case PrescriptionStatus.FILLED:
        return 'primary';
      case PrescriptionStatus.CANCELLED:
        return 'warn';
      case PrescriptionStatus.EXPIRED:
        return 'warn';
      default:
        return '';
    }
  }

  getStatusLabel(status: PrescriptionStatus): string {
    return status.replace(/_/g, ' ');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  canCancel(prescription: Prescription): boolean {
    return (
      prescription.status === PrescriptionStatus.ISSUED ||
      prescription.status === PrescriptionStatus.PARTIALLY_FILLED
    );
  }

  onCancelPrescription(prescription: Prescription): void {
    const reason = prompt('Please enter the reason for cancellation:');
    if (!reason) {
      return;
    }

    this.prescriptionService.cancelPrescription(prescription.id, reason).subscribe({
      next: (result: any) => {
        if (result.data?.cancelPrescription) {
          this.snackbarService.openSnackBar('Prescription cancelled successfully');
          this.onSearch();
        }
      },
      error: (error: any) => {
        this.snackbarService.openErrorSnackBar('Failed to cancel prescription');
        console.error('Error cancelling prescription:', error);
      },
    });
  }
}
