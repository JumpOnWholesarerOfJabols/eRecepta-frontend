import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DoctorService } from '../../../../core/services/doctorService/doctor.service';
import { WeeklyAvailability } from '../../../../core/models/ResponseData';
import { AuthService } from '../../../../core/auth/services/authService/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-show-availability',
  imports: [CommonModule],
  templateUrl: './show-availability.component.html',
  styleUrl: './show-availability.component.css'
})
export class ShowAvailabilityComponent implements OnInit {
  availability: WeeklyAvailability[] = [];
  loading = false;
  @Input() reload$!: Subject<void>;

  constructor(
    private doctorService: DoctorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAvailability();
    
    this.reload$.subscribe({
      next: () => {
        this.loadAvailability();
      }
    })
  }

  loadAvailability() {
    const doctorId = this.authService.getUserId();
    if(!doctorId) {
      return
    }

    this.loading = true;
    this.doctorService.findAllWeeklyAvailabilities(doctorId).subscribe({
      next: (result) => {
        this.loading = false;
        this.availability = result.data?.findAllWeeklyAvailabilities ?? [];
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
