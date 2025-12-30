import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Prescription, PrescriptionStatus } from '../../../../core/models/graphql-data.model';

@Component({
  selector: 'app-prescription-details',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './prescription-details.component.html',
  styleUrl: './prescription-details.component.css',
})
export class PrescriptionDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<PrescriptionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public prescription: Prescription
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  getStatusColor(status: PrescriptionStatus): string {
    switch (status) {
      case PrescriptionStatus.ISSUED:
        return 'primary';
      case PrescriptionStatus.PARTIALLY_FILLED:
        return 'accent';
      case PrescriptionStatus.FILLED:
        return 'primary';
      case PrescriptionStatus.CANCELLED:
        return 'warn';
      case PrescriptionStatus.EXPIRED:
        return 'warn';
      default:
        return '';
    }
  }

  getStatusLabel(status: PrescriptionStatus): string {
    return status.replace(/_/g, ' ');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text);
  }
}
