import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/authServices/authService/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if(this.authService.isLoggedIn()) {
      this.router.navigate(['/main'])
      console.log('App component logged')
    } else {
      console.log('App component NOT logged')
      this.router.navigate([''])
    }
  }
  title = 'App';
}
