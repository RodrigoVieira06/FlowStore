import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastMessage } from '../../models/toast-message';
import { ToasterService } from '../../services/toaster/toaster.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss'
})
export class ToasterComponent {
  public toastMessages: ToastMessage[] = [];

  private subscriptions = new Subscription();

  constructor(private toasterService: ToasterService) {}

  ngOnInit() {
    this.subscriptions = this.toasterService.toastState.subscribe((toast: ToastMessage) => {
      this.toastMessages.push(toast);
      setTimeout(() => this.addShowClass(toast), 10);
      setTimeout(() => this.removeToast(toast), 3000);
    });
  }

  addShowClass(toast: ToastMessage) {
    const index = this.toastMessages.indexOf(toast);
    if (index !== -1) {
      document.getElementById(`toast-${index}`)?.classList.add('show');
    }
  }

  removeToast(toast: ToastMessage) {
    const index = this.toastMessages.indexOf(toast);
    if (index !== -1) {
      const toastElement = document.getElementById(`toast-${index}`);
      toastElement?.classList.remove('show');
      setTimeout(() => {
        this.toastMessages = this.toastMessages.filter(t => t !== toast);
      }, 500);
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
