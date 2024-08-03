import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastMessage } from '../../models/toast-message';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private toastSubject = new Subject<ToastMessage>();
  toastState = this.toastSubject.asObservable();

  showToast(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    this.toastSubject.next({ message, type });
  }
}
