import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

enum ACTIONS {
  SHOW_HISTORY = 'SHOW_HISTORY',
  MAKE_APPOINTMENT = 'MAKE_APPOINTMENT'
}

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule]
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
}
