import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from '../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    AppHeaderComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
}
