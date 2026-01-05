import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { PrescriptionService } from '../../../core/services/prescriptionService/prescription.service';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { FulfillPrescriptionInput, Prescription } from '../../../core/models/graphql-data.model';
import { SnackbarService } from '../../../core/services/snackbarService/snackbar.service';

@Component({
  selector: 'app-pharmacist-dashboard',
  templateUrl: './pharmacist-dashboard.component.html',
  styleUrls: ['./pharmacist-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatFormField, MatLabel, MatInput, FormsModule, ReactiveFormsModule, MatProgressSpinner]
})
export class PharmacistDashboardComponent implements OnInit {
  verifyForm!: FormGroup;
  fulfillForm!: FormGroup;
  loading = false;

  patientPrescription: Prescription | null = null;

  constructor(
    private fb: FormBuilder, 
    private prescriptionService: PrescriptionService,
    private snackBar: SnackbarService
  ) {
    this.verifyForm = fb.group({
      accessCode: ['', [Validators.required, Validators.minLength(6)]],
      patientIdentifier: ['', Validators.required]
    })
    this.fulfillForm = fb.group({
      quantity: [0, [Validators.required, Validators.min(1)]]
    })
  }

  ngOnInit(): void {

  }

  verifyPrescription() {
    if (!this.verifyForm.valid) {
      return;
    }
    this.loading = true;

    const { accessCode, patientIdentifier } = this.verifyForm.value;

    this.prescriptionService.verifyPrescription(accessCode, patientIdentifier).subscribe({
      next: (value) => {
        if (value.data?.verifyPrescription) {
          this.patientPrescription = value.data.verifyPrescription;
        }

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      }
    })

  }

  fulfill() {
    if (!this.fulfillForm.valid) {
      this.snackBar.openErrorSnackBar('Unknown error')
      return;
    }

    const { quantity } = this.fulfillForm.value;


    if (quantity < this.patientPrescription?.totalPackages!) {
      const input: FulfillPrescriptionInput = {
        prescriptionId: this.patientPrescription?.id!,
        quantity: quantity
      }

      this.prescriptionService.fulfillPrescription(input).subscribe({
        next: (value) => {
          if (value.data?.fulfillPrescription) {
            this.patientPrescription = value.data.fulfillPrescription.updatedPrescription;
            this.snackBar.openSnackBar('Fulfilled successfully!')
          }
        },
        error: (err) => {

        }
      })
    }
  }

}
