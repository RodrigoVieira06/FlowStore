import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToasterComponent } from './toaster.component';
import { ToastMessage } from '../../models/toast-message';
import { ToasterService } from '../../services/toaster/toaster.service';

describe('ToasterComponent', () => {
  let component: ToasterComponent;
  let fixture: ComponentFixture<ToasterComponent>;
  let toasterService: ToasterService;

  const mockToastMessage: ToastMessage = {
    message: 'Test Toast',
    type: 'success'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ToasterComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ToasterComponent);
    component = fixture.componentInstance;
    toasterService = TestBed.inject(ToasterService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove the toast message after 3 seconds', (done) => {
    component.toastMessages = [mockToastMessage];

    spyOn(component, 'removeToast').and.callThrough();

    component.removeToast(mockToastMessage);

    setTimeout(() => {
      expect(component.toastMessages).not.toContain(mockToastMessage);
      expect(component.removeToast).toHaveBeenCalledWith(mockToastMessage);
      done();
    }, 3500);
  });

  it('should unsubscribe from toasterService on destroy', () => {
    spyOn(component['subscriptions'], 'unsubscribe');
    component.ngOnDestroy();
    expect(component['subscriptions'].unsubscribe).toHaveBeenCalled();
  });
});
