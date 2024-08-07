import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit true when show() is called', (done) => {
    service.show();
    service.isLoading.subscribe((loading) => {
      expect(loading).toBeTrue();
      done();
    });
  });

  it('should emit false when hide() is called', (done) => {
    service.hide();
    service.isLoading.subscribe((loading) => {
      expect(loading).toBeFalse();
      done();
    });
  });
});
