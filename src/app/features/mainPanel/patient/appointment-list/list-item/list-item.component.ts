import { Component, Input, output } from '@angular/core';
import { Visit, VisitStatus } from '../../../../../core/models/graphql-data.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from '../../../../../shared/components/confirm/confirm.dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-item-visit',
  imports: [CommonModule],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.css'
})
export class VisitListItemComponent {
  @Input({required: true}) visit!: Visit;

  VISIT_STATUS = VisitStatus;
  readonly cancelOutput = output<string>(); 

  constructor(private dialog: MatDialog) {}

  cancelVisit() {
    let dialogRef = this.dialog.open(ConfirmDialog);
    dialogRef.afterClosed().subscribe({
      next: (value) => {
        if(value) {
          this.cancelOutput.emit(this.visit.id);
        } 
      },
    })
  }
}
