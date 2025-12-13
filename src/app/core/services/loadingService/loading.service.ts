import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private counter = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);

  readonly loading$ = this.loadingSubject.asObservable();

  show(): void {
    this.counter++;
    if (this.counter > 0) this.loadingSubject.next(true);
    console.log('s' + this.counter);
  }

  hide(): void {
    if (this.counter > 0) this.counter--;
    if (this.counter === 0) this.loadingSubject.next(false);
    console.log('h' + this.counter);
  }

  reset(): void {
    this.counter = 0;
    this.loadingSubject.next(false);
  }
}
