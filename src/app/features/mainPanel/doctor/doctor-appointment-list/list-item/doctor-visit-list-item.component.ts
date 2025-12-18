import { Component, Input, output } from '@angular/core';
import { Visit, VisitStatus } from '../../../../../core/models/graphql-data.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../../shared/components/confirm/confirm.dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-visit-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-visit-list-item.component.html',
  styleUrl: './doctor-visit-list-item.component.css'
})
export class DoctorVisitListItemComponent {
  @Input({ required: true }) visit!: Visit;
  VISIT_STATUS = VisitStatus;
  readonly cancelOutput = output<string>();
  readonly completeOutput = output<string>();

  constructor(private dialog: MatDialog) {}

  cancelVisit() {
    const dialogRef = this.dialog.open(ConfirmDialog);
    dialogRef.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.cancelOutput.emit(this.visit.id);
        }
      },
    });
  }

  completeVisit() {
    const dialogRef = this.dialog.open(ConfirmDialog);
    dialogRef.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.completeOutput.emit(this.visit.id);
        }
      },
    });
  }
}
