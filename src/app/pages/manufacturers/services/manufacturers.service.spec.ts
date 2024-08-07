import { TestBed } from '@angular/core/testing';

import { ManufacturersService } from './manufacturers.service';
import { provideHttpClient } from '@angular/common/http';

describe('ManufacturersService', () => {
  let service: ManufacturersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(ManufacturersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
