import { Component, Input, output } from '@angular/core';
import { User } from '../../../core/models/UserData';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { ConfirmDeleteDialog } from '../confirm/confirm.dialog';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatChipsModule, 
    MatIconModule,
    MatDialogModule
  ]
})

export class ListItemComponent {
  @Input() item!: User;
  readonly deleteUserEvent = output<String>();

  constructor(private dialog: MatDialog) {}

  deleteUser() {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUserEvent.emit(this.item.id);
      }
    });
  }
}
