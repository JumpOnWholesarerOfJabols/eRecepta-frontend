import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-custom-snackbar',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex justify-between items-center text-base">
        <div class="flex-1 min-w-0 space-y-2 mr-4">
            <div *ngIf="isString(this.data.message); else multipleMessages">
                <div class="wrap-break-word">{{ data.message }}</div>
            </div>
            <ng-template #multipleMessages>
                <ul class="list-disc list-inside space-y-2">
                    <li *ngFor="let error of messageArray" class="wrap-break-word">{{ error }}</li>
                </ul>
            </ng-template>
        </div>
        <button (click)="close()" class="shrink-0 bg-transparent border-none text-2xl cursor-pointer p-0 opacity-70 hover:opacity-100 transition-opacity duration-200">×</button>
    </div>
  `,
    styles: []
})
export class CustomSnackbarComponent {
    constructor(
        @Inject(MAT_SNACK_BAR_DATA) public data: { message: string | string[] },
        private snackBarRef: MatSnackBarRef<CustomSnackbarComponent>
    ) { }

    isString(value: any): boolean {
        return typeof value === 'string';
    }

    get messageArray(): string[] {
        if (Array.isArray(this.data.message)) {
            return this.data.message;
        }
        return [];
    }

    close(): void {
        this.snackBarRef.dismiss();
    }
}
