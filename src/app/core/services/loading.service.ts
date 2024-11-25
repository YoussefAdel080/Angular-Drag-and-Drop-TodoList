import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading = signal(true);

  constructor() { }

  showSpinner(){
    this.isLoading.set(true);
  }

  hideSpinner(){
    this.isLoading.set(false);
  }
}
