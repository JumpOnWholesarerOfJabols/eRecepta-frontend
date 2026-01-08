import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-shared-header',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './app-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent {
  @Input() title = 'eRecepta';
  @Input() subtitle = 'Electronic prescriptions system';
  @Input() showLogout = false;
  @Input() logoutLabel = 'Log out';
  @Output() logout = new EventEmitter<void>();

  onLogout(): void {
    this.logout.emit();
  }
}
