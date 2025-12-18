import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { PatientService } from '../../../../core/services/patientService/patient.service';
import { Visit, VisitStatus } from '../../../../core/models/graphql-data.model';
import { VisitListItemComponent } from './list-item/list-item.component';
import { SnackbarService } from '../../../../core/services/snackbarService/snackbar.service';
import { MatCheckbox } from "@angular/material/checkbox";
import { MatCardHeader, MatCardTitle } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-appointment-list',
  imports: [VisitListItemComponent, MatCheckbox, MatCardTitle, CommonModule, FormsModule],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css'
})
export class AppointmentListComponent implements OnInit {
  visits: Visit[] = [];
  VISIT_STATUS = VisitStatus;
  showCanceled: boolean = true;

  constructor(
    private patientService: PatientService,
    private snackBar: SnackbarService
  ) { };

  ngOnInit() {
    this.patientService.getAppointments().subscribe({
      next: (result) => {
        this.visits = result.data?.findAllVisits!
      }
    })
  }

  cancelVisit(id: string) {
    this.patientService.cancelVisit(id).subscribe({
      next: (result) => {
        if (result.data?.cancelVisit) {
          this.visits = this.visits.map(visit =>
            visit.id === id 
            ? {...visit, visitStatus: this.VISIT_STATUS.CANCELLED}
            : visit
          )
          this.snackBar.openSnackBar("Appointment canceled successfully!");
        }
      }
    })
  }

  get filteredVisits() {
    return this.showCanceled ?
      this.visits :
      this.visits.filter(visit => visit.visitStatus !== this.VISIT_STATUS.CANCELLED);
  }
}
