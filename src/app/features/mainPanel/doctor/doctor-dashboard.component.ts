import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CreateAvailabilityComponent } from './create-availability/create-availability.component';
import { ShowAvailabilityComponent } from "./show-availability/show-availability.component";
import { DoctorAppointmentListComponent } from './doctor-appointment-list/doctor-appointment-list.component';
import { IssuePrescriptionComponent } from './issue-prescription/issue-prescription.component';
import { PrescriptionListComponent } from './prescription-list/prescription-list.component';
import { Subject } from 'rxjs';
import { ManageSpecializationComponent } from "./manage-specialization/manage-specialization.component";

enum ACTIONS {
  AVAILABILITY,
  APPOINTMENTS,
  MANAGE_SPECIALIZATION,
  ISSUE_PRESCRIPTION,
  PRESCRIPTION_HISTORY,
}

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule, 
    MatCardModule, 
    MatIconModule, 
    CreateAvailabilityComponent, 
    ShowAvailabilityComponent, 
    DoctorAppointmentListComponent, 
    ManageSpecializationComponent,
    IssuePrescriptionComponent,
    PrescriptionListComponent
  ],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.css'
})
export class DoctorDashboardComponent {

  ACTIONS = ACTIONS;
  action: ACTIONS = ACTIONS.AVAILABILITY;

  reload$ = new Subject<void>();

  showAvailability() {
    this.action = ACTIONS.AVAILABILITY;
  }

  showAppointments() {
    this.action = ACTIONS.APPOINTMENTS;
  }

  manageSpecialization() {
    this.action = ACTIONS.MANAGE_SPECIALIZATION;
  }

  showIssuePrescription() {
    this.action = ACTIONS.ISSUE_PRESCRIPTION;
  }

  showPrescriptionHistory() {
    this.action = ACTIONS.PRESCRIPTION_HISTORY;
  }

  updateAvailability() {
    this.reload$.next();
  }

  onPrescriptionIssued() {
    this.action = ACTIONS.PRESCRIPTION_HISTORY;
  }

}
