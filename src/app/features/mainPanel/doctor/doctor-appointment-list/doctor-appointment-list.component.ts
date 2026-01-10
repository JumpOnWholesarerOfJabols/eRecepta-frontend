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
import { MatCalendar, MatDatepicker, MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { formatDate } from '../../../../shared/utils/dateFormatter';
import { BehaviorSubject, combineLatest, Observable, forkJoin, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { AuthApiService } from '../../../../core/auth/services/authApi/auth-api.service';

@Component({
  selector: 'app-doctor-appointment-list',
  standalone: true,
  imports: [DoctorVisitListItemComponent, MatCheckbox, MatCardTitle, CommonModule, FormsModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, MatButtonModule],
  templateUrl: './doctor-appointment-list.component.html',
  styleUrl: './doctor-appointment-list.component.css'
})
export class DoctorAppointmentListComponent implements OnInit {
  VISIT_STATUS = VisitStatus;

  private visitsSubject = new BehaviorSubject<Visit[]>([]);
  private showCanceledSubject = new BehaviorSubject<boolean>(true);
  private chosenDateSubject = new BehaviorSubject<Date | null>(null);

  visits$ = this.visitsSubject.asObservable();
  showCanceled$ = this.showCanceledSubject.asObservable();
  chosenDate$ = this.chosenDateSubject.asObservable();

  filteredVisits$: Observable<Visit[]> = combineLatest([
    this.visits$.pipe(startWith([])),
    this.showCanceled$.pipe(startWith(true)),
    this.chosenDate$.pipe(startWith(null))
  ]).pipe(
    map(([visits, showCanceled, chosenDate]) => {
      let filtered = visits;

      if (!showCanceled) {
        filtered = filtered.filter(v => v.visitStatus !== VisitStatus.CANCELLED);
      }

      if (chosenDate) {
        const formattedDate = formatDate(chosenDate);
        filtered = filtered.filter(v => v.visitTime?.startsWith(formattedDate));
      }

      return filtered;
    })
  );

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService,
    private snackBar: SnackbarService,
    private authApiService: AuthApiService
  ) {}

  ngOnInit() {
    const doctorId = this.authService.getUserId();
    this.doctorService.getAppointments()
      .pipe(
        switchMap((result) => {
          const all = result.data?.findAllVisits ?? [];
          const filtered = doctorId ? all.filter(v => v.doctorId === doctorId) : all;
          
          if (filtered.length === 0) {
            return of(filtered);
          }
          
          return forkJoin(
            filtered.map(visit =>
              this.authApiService.getUserInfo(visit.patientId).pipe(
                map(userResult => ({
                  ...visit,
                  patientFirstName: userResult.data?.getUserInfo?.firstName ?? '',
                  patientLastName: userResult.data?.getUserInfo?.lastName ?? '',
                  patientPesel: userResult.data?.getUserInfo?.pesel ?? visit.patientId
                }))
              )
            )
          );
        })
      )
      .subscribe({
        next: (visitsWithPatientInfo) => {
          this.visitsSubject.next(visitsWithPatientInfo);
        },
        error: (err) => {
          console.error('Error loading appointments:', err);
          this.snackBar.openErrorSnackBar('Failed to load appointments');
        }
      });
  }

  cancelVisit(id: string) {
    this.doctorService.cancelVisit(id).subscribe({
      next: (result) => {
        if (result.data?.cancelVisit) {
          const updated = this.visitsSubject.value.map(visit =>
            visit.id === id ? { ...visit, visitStatus: this.VISIT_STATUS.CANCELLED } : visit
          );
          this.visitsSubject.next(updated);
          this.snackBar.openSnackBar('Appointment canceled successfully!');
        }
      }
    });
  }

  completeVisit(id: string) {
    this.doctorService.completeVisit(id, VisitStatus.COMPLETED).subscribe({
      next: (result) => {
        if (result.data?.updateVisitStatus) {
          const updated = this.visitsSubject.value.map(visit =>
            visit.id === id ? { ...visit, visitStatus: this.VISIT_STATUS.COMPLETED } : visit
          );
          this.visitsSubject.next(updated);
          this.snackBar.openSnackBar('Appointment marked as completed!');
        }
      }
    });
  }

  clearFilters() {
    this.chosenDateSubject.next(null);
    this.showCanceledSubject.next(true);
  }

  set showCanceled(value: boolean) {
    this.showCanceledSubject.next(value);
  }

  get showCanceled(): boolean {
    return this.showCanceledSubject.value;
  }

  set chosenDate(value: Date | null) {
    this.chosenDateSubject.next(value);
  }

  get chosenDate(): Date | null {
    return this.chosenDateSubject.value;
  }
}
