import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-dialog',
  template: `
    <h2 mat-dialog-title>Confirmation</h2>
    <mat-dialog-content>
      <p>Are you sure you want to do this?</p>
    </mat-dialog-content>
    <mat-dialog-actions >
      <button mat-button matDialogClose>Cancel</button>
      <button mat-button [matDialogClose]="true" color="warn">Confirm</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, MatDialogModule]
})
export class ConfirmDeleteDialog {}
