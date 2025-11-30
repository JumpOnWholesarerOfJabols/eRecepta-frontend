import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/authServices/authService/auth.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { LoadingService } from './services/loadingService/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatProgressBarModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public loading$;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.loading$ = this.loadingService.loading$;
  }

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
