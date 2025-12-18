import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AppointmentComponent } from "./makeAppointment/appointment.component";
import { AppointmentListComponent } from "./appointment-list/appointment-list.component";
import { PatientHistoryComponent } from "./patient-history/patient-history.component";

enum ACTIONS {
  SHOW_HISTORY = 'SHOW_HISTORY',
  MAKE_APPOINTMENT = 'MAKE_APPOINTMENT',
  SHOW_APPOINTMENTS = 'SHOW_APPOINTMENTS'
}

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, AppointmentComponent, AppointmentListComponent, PatientHistoryComponent]
})
export class PatientDashboardComponent {
  action: ACTIONS | null = null;
  ACTIONS = ACTIONS;

  showMyHistory(): void {
    this.action = ACTIONS.SHOW_HISTORY;
  }

  makeAppointment(): void {
    this.action = ACTIONS.MAKE_APPOINTMENT;
  }

  showAppointments(): void {
    this.action = ACTIONS.SHOW_APPOINTMENTS;
  }
}
