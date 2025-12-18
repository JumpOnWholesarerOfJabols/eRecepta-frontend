import { Component } from '@angular/core';
import { AuthService } from '../../../core/auth/services/authService/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { Role } from '../../../core/models/UserData';


@Component({
  selector: 'app-main',
  imports: [RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  USER_ROLE = Role;
  userRole: Role | null = null;

  constructor(private authService: AuthService, private router: Router) {};

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

  logout() {
    this.authService.logout();
    this.router.navigate([''])
  }
}
