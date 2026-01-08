import { Component, DestroyRef, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/services/authService/auth.service';
import { AuthApiService } from '../../../core/auth/services/authApi/auth-api.service';
import { Router, RouterOutlet } from '@angular/router';
import { Role } from '../../../core/models/UserData';
import { AppHeaderComponent } from '../../../shared/components/app-header/app-header.component';
import { LogoutType } from '../../../shared/utils/LogoutType';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-main',
  imports: [RouterOutlet, AppHeaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  USER_ROLE = Role;
  userRole: Role | null = null;
  private destroyRef = inject(DestroyRef);

  constructor(
    private authService: AuthService,
    private authApiService: AuthApiService,
    private router: Router
  ) {};

  ngOnInit() {
    console.log("Token po zalogowaniu: " + this.authService.getToken())
    console.log('czy zalogowany: ', this.authService.isLoggedIn())

    this.userRole = this.authService.getUserRole();
    if (!this.authService.isLoggedIn() || !this.userRole) {
      this.router.navigate(['']);
    }

    if(this.userRole === this.USER_ROLE.ADMINISTRATOR) {
      this.router.navigate(['main/adminDashboard'])
    } else if(this.userRole === this.USER_ROLE.PATIENT) {
      this.router.navigate(['main/patientDashboard'])
    } else if(this.userRole === this.USER_ROLE.DOCTOR) {
      this.router.navigate(['main/doctorDashboard'])
    } else if(this.userRole === this.USER_ROLE.PHARMACIST) {
      this.router.navigate(['main/pharmacistDashboard'])
    } else {
      alert("HACKED!!!!!!!!")
    }
  }

  logout(type: LogoutType) {
    const refreshToken = this.authService.getRefreshToken();

    if (type === LogoutType.LOGOUT_ALL_DEVICES && refreshToken) {
      this.authApiService.logoutFromOtherDevices(refreshToken)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.authService.logout();
            this.router.navigate(['']);
          },
          error: () => {
            this.authService.logout();
            this.router.navigate(['']);
          }
        });
    } else {
      this.authService.logout();
      this.router.navigate(['']);
    }
  }
}
