import { Component } from '@angular/core';
import { AuthService } from '../../../services/authServices/authService/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  constructor(private authService: AuthService, private router: Router) {};

  ngOnInit() {
    console.log(this.authService.getToken())
    console.log('czy zalogowany: ', this.authService.isLoggedIn())
  }

  logout() {
    this.authService.logout();
    this.router.navigate([''])
  }
}
