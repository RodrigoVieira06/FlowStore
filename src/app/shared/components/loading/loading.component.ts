import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent {
  public isLoading = false;

  constructor(private loadingService: LoadingService) { }

  ngOnInit() {
    this.loadingService.isLoading.subscribe((status: boolean) => {
      this.isLoading = status;
    });
  }
}
