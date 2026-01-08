import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Medication } from '../../../../core/models/MedicationData';
import { MatOption, MatSelect } from "@angular/material/select";
import { MedicationService } from '../../../../core/services/medicationService/medication.service';
import { MatButton, MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PrescriptionService } from '../../../../core/services/prescriptionService/prescription.service';
import { IssuePrescriptionInput, Prescription } from '../../../../core/models/graphql-data.model';
import { SnackbarService } from '../../../../core/services/snackbarService/snackbar.service';
import { formatDate } from '../../../../shared/utils/dateFormatter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { PatientService } from '../../../../core/services/patientService/patient.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm/confirm.dialog';

@Component({
  selector: 'app-issue-prescription',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatOption,
    MatSelect,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './issue-prescription.component.html',
  styleUrl: './issue-prescription.component.css',
})
export class IssuePrescriptionComponent implements OnInit {
  loading = false;
  checkingInteractions = false;

  prescriptionForm!: FormGroup;
  allMedications: Medication[] = [];
  addedMedications: Map<Medication, number> = new Map();

  getTomorrowDate(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  constructor(
    private fb: FormBuilder,
    private medicationService: MedicationService,
    private prescriptionService: PrescriptionService,
    private patientService: PatientService,
    private snackbar: SnackbarService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadMedications()
  }

  initForm(): void {

    this.prescriptionForm = this.fb.group({
      patientId: ['', Validators.required],
      medicationId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      expiration: [this.getTomorrowDate(), Validators.required],
    });
  }

  private loadMedications() {
    this.loading = true;
    this.medicationService.medications().subscribe({
      next: (value) => {
        if (value.data?.medications) {
          this.allMedications = value.data?.medications;
        }
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackbar.openErrorSnackBar('Failed to load medications');
        console.error('Error loading medications:', error);
      }
    });
  }

  onSubmit(): void {
    this.issuePrescription();
  }

  deleteMedicationFromPrescription(med: Medication) {
    this.addedMedications.delete(med);
  }

  addMedicationToPrescription() {
    const medicationControl = this.prescriptionForm.get('medicationId');
    const quantityControl = this.prescriptionForm.get('quantity');

    const medicationId = medicationControl?.value;
    const quantity = quantityControl?.value;

    if (!medicationId || !quantity || quantity < 1) {
      this.snackbar.openErrorSnackBar('Please select a medication and valid quantity');
      return;
    }

    const newMedication = this.allMedications.find(m => m.id === medicationId);
    if (!newMedication) { return; }

    if (this.addedMedications.has(newMedication)) {
      this.snackbar.openSnackBar('This medication has already been added');
      return;
    }

    const patientId = this.prescriptionForm.get('patientId')?.value as string | undefined;
    const addedIds = Array.from(this.addedMedications.keys()).map(m => m.id);
    const baseIds$ = patientId 
      ? this.patientService.getPatientRecord(patientId).pipe(map(res => res.data?.getPatientRecordByUserId?.medications ?? []))
      : of([] as string[]);

    this.checkingInteractions = true;
    baseIds$.pipe(
      switchMap((currentIds) => {
        const set = new Set<string>([...currentIds, ...addedIds]);
        return this.medicationService.checkInteractions(newMedication.id, Array.from(set));
      })
    ).subscribe({
      next: (result) => {
        const interactions = result.data?.checkInteractions ?? [];
        const hasContra = interactions.some(i => i.riskLevel === 'CONTRAINDICATED');
        const hasHighOrModerate = interactions.some(i => i.riskLevel === 'HIGH' || i.riskLevel === 'MODERATE');

        if (hasContra) {
          this.snackbar.openErrorSnackBar('Contraindicated interaction detected. Cannot add.');
          this.checkingInteractions = false;
          return;
        }

        const proceed = () => {
          this.addedMedications.set(newMedication, quantity);
          this.snackbar.openSnackBar('Medication added successfully', 2000);
          medicationControl?.reset('');
          quantityControl?.reset(1);
          this.checkingInteractions = false;
        };

        if (hasHighOrModerate) {
          const dialogRef = this.dialog.open(ConfirmDialog);
          dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
              proceed();
            } else {
              this.checkingInteractions = false;
            }
          });
        } else {
          if (interactions.length > 0) {
            this.snackbar.openSnackBar('Interactions found (LOW risk). Proceeding.', 2000);
          }
          proceed();
        }
      },
      error: (error) => {
        console.error('Error checking interactions:', error);
        this.snackbar.openErrorSnackBar('Failed to check interactions');
        this.checkingInteractions = false;
      }
    });
  }

  issuePrescription() {
    if (this.addedMedications.size === 0) {
      this.snackbar.openErrorSnackBar('Please add at least one medication');
      return;
    }

    const patientIdControl = this.prescriptionForm.get('patientId');
    const expirationControl = this.prescriptionForm.get('expiration');

    if (!patientIdControl?.valid || !expirationControl?.valid) {
      this.snackbar.openErrorSnackBar('Please fill in all required fields');
      return;
    }

    const patientId: string = patientIdControl.value;
    const expirationDate: Date = expirationControl.value;
    const expiration: string = formatDate(expirationDate);

    this.loading = true;
    const requests: Observable<Apollo.MutateResult<{ issuePrescription: Prescription; }>>[] = [];

    this.addedMedications.forEach((quantity: number, medication: Medication) => {
      const prescriptionInput: IssuePrescriptionInput = {
        patientId: patientId,
        medicationId: medication.id,
        quantity: quantity,
        expiration: expiration,
      };

      requests.push(this.prescriptionService.issuePrescription(prescriptionInput));
    });

    forkJoin(requests).subscribe({
      next: (responses) => {
        this.loading = false;
        
        const accessCodes: string[] = responses
          .map(response => response.data?.issuePrescription?.accessCode)
          .filter((code): code is string => !!code);

        if (accessCodes.length === this.addedMedications.size) {
          let message = `Successfully issued ${accessCodes.length} prescription(s)`;
          this.snackbar.openSnackBar(message, 8000);
        } else if (accessCodes.length > 0) {
          this.snackbar.openSnackBar(
            `Issued ${accessCodes.length} of ${this.addedMedications.size} prescription(s)`,
            5000
          );
        } else {
          this.snackbar.openErrorSnackBar('Failed to issue any prescriptions');
        }

        if (accessCodes.length > 0) {
          // After issuing prescriptions, record medications in patient info
          const addMedicationCalls: Observable<Apollo.MutateResult<{ addMedication: any }>>[] = [];
          this.addedMedications.forEach((_, medication: Medication) => {
            addMedicationCalls.push(this.patientService.addMedication(patientId, medication.id));
          });

          forkJoin(addMedicationCalls).subscribe({
            next: () => {
              this.snackbar.openSnackBar('Patient record updated with medications', 3000);
              this.resetForm();
            },
            error: (e) => {
              console.error('Error recording medications in patient record:', e);
              this.snackbar.openErrorSnackBar('Prescriptions issued, but failed to record medications');
              this.resetForm();
            }
          });
        }
      },
      error: (err) => {
        this.loading = false;
        this.snackbar.openErrorSnackBar('Unable to issue prescriptions');
        console.error('Error issuing prescriptions:', err);
      }
    });
  }

  private resetForm() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    this.addedMedications.clear();
    this.prescriptionForm.patchValue({
      patientId: '',
      medicationId: '',
      quantity: 1,
      expiration: tomorrow
    });
    this.prescriptionForm.markAsUntouched();
  }

  incrementQuantity(): void {
    const ctrl = this.prescriptionForm.get('quantity');
    const current = Number(ctrl?.value) || 0;
    ctrl?.setValue(current + 1);
  }

  decrementQuantity(): void {
    const ctrl = this.prescriptionForm.get('quantity');
    const current = Number(ctrl?.value) || 1;
    const next = Math.max(1, current - 1);
    ctrl?.setValue(next);
  }
}
