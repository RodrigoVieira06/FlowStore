import { TestBed } from '@angular/core/testing';

import { ToasterService } from './toaster.service';
import { Subject } from 'rxjs';
import { ToastMessage } from '../../models/toast-message';

describe('ToasterService', () => {
  let service: ToasterService;
  let toastSubject: Subject<ToastMessage>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit a toast message', (done) => {
    const testMessage = 'Test message';
    const testType: 'success' | 'error' | 'info' | 'warning' = 'success';

    service.toastState.subscribe({
      next: (message: ToastMessage) => {
        expect(message.message).toBe(testMessage);
        expect(message.type).toBe(testType);
        done();
      }
    });

    service.showToast(testMessage, testType);
  });
});
