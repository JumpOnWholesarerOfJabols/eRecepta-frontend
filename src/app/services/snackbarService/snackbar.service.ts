import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomSnackbarComponent } from './custom-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(message: string | string[], duration: number = 3000) {
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: { message },
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  openErrorSnackBar(message: string | string[], duration: number = 5000) {
    let calculatedDuration = typeof message === 'string' ? duration : message.length * 3000;
    
    this.snackBar.openFromComponent(CustomSnackbarComponent, {
      data: { message },
      duration: calculatedDuration ,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }
}
