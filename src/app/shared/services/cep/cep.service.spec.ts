import { TestBed } from '@angular/core/testing';

import { CepService } from './cep.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Cep } from '../../models/cep';
import { environment } from '../../../../environments/environment.development';

describe('CepService', () => {
  let service: CepService;
  let httpMock: HttpTestingController;

  const mockCep: Cep = {
    cep: '12345678',
    logradouro: 'Rua Teste',
    complemento: '',
    bairro: 'Bairro Teste',
    localidade: 'Cidade Teste',
    uf: 'SP',
    ibge: '1234567',
    gia: '1234',
    ddd: '11',
    siafi: '1234'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CepService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch address by CEP', () => {
    const cep = '12345678';
    const url = `${environment.VIACEP_URL}/${cep}/json/`;

    service.getAddress(cep).subscribe(response => {
      expect(response).toEqual(mockCep);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockCep);
  });
});
