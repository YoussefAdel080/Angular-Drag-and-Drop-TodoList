import { Component, inject } from '@angular/core';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {
  private loadingService = inject(LoadingService);
  ngOnInit(): void {
    this.loadingService.hideSpinner();
  }

  ngOnDestroy(): void {
    this.loadingService.showSpinner();
  }
}
