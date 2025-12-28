import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CreateAvailabilityComponent } from './create-availability/create-availability.component';
import { ShowAvailabilityComponent } from "./show-availability/show-availability.component";
import { DoctorAppointmentListComponent } from './doctor-appointment-list/doctor-appointment-list.component';
import { Subject } from 'rxjs';
import { ManageSpecializationComponent } from "./manage-specialization/manage-specialization.component";

enum ACTIONS {
  AVAILABILITY,
  APPOINTMENTS,
  MANAGE_SPECIALIZATION,
}

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, CreateAvailabilityComponent, ShowAvailabilityComponent, DoctorAppointmentListComponent, ManageSpecializationComponent],
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

  updateAvailability() {
    this.reload$.next();
  }

}
