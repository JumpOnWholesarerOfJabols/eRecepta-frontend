import { Component, OnInit } from '@angular/core';
import { PatientService } from '../../../../core/services/patientService/patient.service';
import { Visit, VisitStatus } from '../../../../core/models/graphql-data.model';
import { DoctorVisitListItemComponent } from './list-item/doctor-visit-list-item.component';
import { SnackbarService } from '../../../../core/services/snackbarService/snackbar.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatCardTitle } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/auth/services/authService/auth.service';
import { DoctorService } from '../../../../core/services/doctorService/doctor.service';

@Component({
  selector: 'app-doctor-appointment-list',
  standalone: true,
  imports: [DoctorVisitListItemComponent, MatCheckbox, MatCardTitle, CommonModule, FormsModule],
  templateUrl: './doctor-appointment-list.component.html',
  styleUrl: './doctor-appointment-list.component.css'
})
export class DoctorAppointmentListComponent implements OnInit {
  visits: Visit[] = [];
  VISIT_STATUS = VisitStatus;
  showCanceled: boolean = true;

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService,
    private snackBar: SnackbarService
  ) {}

  ngOnInit() {
    const doctorId = this.authService.getUserId();
    this.doctorService.getAppointments().subscribe({
      next: (result) => {
        const all = result.data?.findAllVisits ?? [];
        this.visits = doctorId ? all.filter(v => v.doctorId === doctorId) : all;
      }
    });
  }

  cancelVisit(id: string) {
    this.doctorService.cancelVisit(id).subscribe({
      next: (result) => {
        if (result.data?.cancelVisit) {
          this.visits = this.visits.map(visit =>
            visit.id === id ? { ...visit, visitStatus: this.VISIT_STATUS.CANCELLED } : visit
          );
          this.snackBar.openSnackBar('Appointment canceled successfully!');
        }
      }
    });
  }

  completeVisit(id: string) {
    this.doctorService.completeVisit(id, VisitStatus.COMPLETED).subscribe({
      next: (result) => {
        if (result.data?.updateVisitStatus) {
          this.visits = this.visits.map(visit =>
            visit.id === id ? { ...visit, visitStatus: this.VISIT_STATUS.COMPLETED } : visit
          );
          this.snackBar.openSnackBar('Appointment marked as completed!');
        }
      }
    });
  }

  get filteredVisits() {
    return this.showCanceled ?
      this.visits :
      this.visits.filter(visit => visit.visitStatus !== this.VISIT_STATUS.CANCELLED);
  }
}
