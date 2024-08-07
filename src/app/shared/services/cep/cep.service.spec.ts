import { TestBed } from '@angular/core/testing';

import { CepService } from './cep.service';
import { provideHttpClient } from '@angular/common/http';

describe('CepService', () => {
  let service: CepService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(CepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
