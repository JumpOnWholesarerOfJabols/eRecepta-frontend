import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs/operators';
import { Specialization } from '../../../../core/models/graphql-data.model';
import { DoctorService } from '../../../../core/services/doctorService/doctor.service';
import { SnackbarService } from '../../../../core/services/snackbarService/snackbar.service';

@Component({
  selector: 'app-manage-specialization',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './manage-specialization.component.html',
  styleUrl: './manage-specialization.component.css'
})
export class ManageSpecializationComponent implements OnInit {
  loading = false;
  mutating = false;
  specializations: Specialization[] = [];
  readonly availableSpecializations = Object.values(Specialization);
  specializationControl = new FormControl<Specialization | null>(null);

  constructor(private doctorService: DoctorService, private snackbar: SnackbarService) {}

  ngOnInit() {
    this.loadSpecializations();
  }

  loadSpecializations() {
    this.loading = true;
    this.doctorService
      .findAllSpecializations()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (result) => {
          this.specializations = result.data?.findAllSpecializations ?? [];
        },
      });
  }

  addSpecialization() {
    const specialization = this.specializationControl.value;
    if (!specialization || this.mutating) {
      return;
    }

    this.mutating = true;
    this.doctorService
      .createSpecialization(specialization)
      .pipe(finalize(() => (this.mutating = false)))
      .subscribe({
        next: (result) => {
          if (result.data?.createSpecialization) {
            this.specializations = [...this.specializations, specialization];
            this.specializationControl.setValue(null);
            this.snackbar.openSnackBar('Specialization added');
          }
        },
      });
  }

  removeSpecialization(specialization: Specialization) {
    if (this.mutating) {
      return;
    }

    this.mutating = true;
    this.doctorService
      .deleteSpecialization(specialization)
      .pipe(finalize(() => (this.mutating = false)))
      .subscribe({
        next: (result) => {
          if (result.data?.deleteSpecialization) {
            this.specializations = this.specializations.filter((s) => s !== specialization);
            if (this.specializationControl.value === specialization) {
              this.specializationControl.setValue(null);
            }
            this.snackbar.openSnackBar('Specialization removed');
          }
        },
      });
  }

  getSelectableSpecializations(): Specialization[] {
    return this.availableSpecializations.filter((spec) => !this.specializations.includes(spec));
  }

  humanizeSpecialization(spec: Specialization): string {
    return spec
      .toLowerCase()
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  trackBySpec(_index: number, spec: Specialization) {
    return spec;
  }
}
