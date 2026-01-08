import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { LogoutType } from '../../utils/LogoutType';

@Component({
  selector: 'app-shared-header',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule
  ],
  templateUrl: './app-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent {
  @Input() title = 'eRecepta';
  @Input() subtitle = 'Electronic prescriptions system';
  @Input() showLogout = false;
  @Input() logoutLabel = 'Log out';
  @Output() logout = new EventEmitter<LogoutType>();

  LogoutType = LogoutType;

  onLogout(type: LogoutType): void {
    this.logout.emit(type);
  }
}
