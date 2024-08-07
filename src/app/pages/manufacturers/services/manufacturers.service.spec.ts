import { TestBed } from '@angular/core/testing';

import { ManufacturersService } from './manufacturers.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PaginatedResponse } from '../../../shared/models/paginated-response';
import { Manufacturer } from '../models/manufacturer';
import { environment } from '../../../../environments/environment.development';

describe('ManufacturersService', () => {
  let service: ManufacturersService;
  let httpMock: HttpTestingController;

  const mockManufacturer: Manufacturer = {
    id: 1,
    nome: 'Test Manufacturer',
    cnpj: '12345678000195',
    cep: '12345678',
    logradouro: 'Rua Teste',
    numero: '123',
    complemento: '',
    bairro: 'Bairro Teste',
    cidade: 'Cidade Teste',
    estado: 'SP',
    contato: 'test@test.com',
    contatoTipo: 'Email'
  };

  const mockPaginatedResponse: PaginatedResponse<Manufacturer> = {
    content: [mockManufacturer],
    "pageable": {
      "pageNumber": 0,
      "pageSize": 10,
      "sort": {
        "empty": false,
        "sorted": true,
        "unsorted": false
      },
      "offset": 0,
      "paged": true,
      "unpaged": false
    },
    "totalPages": 2,
    "totalElements": 14,
    "last": false,
    "size": 10,
    "number": 0,
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "numberOfElements": 10,
    "first": true,
    "empty": false
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ManufacturersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch manufacturers', () => {
    const pageSize = 10;
    const pageIndex = 0;
    const url = `${environment.BASE_URL}${environment.MANUFACTURERS_ENDPOINT}?&pageSize=${pageSize}&initialPage=${pageIndex}`;

    service.getManufacturers(pageSize, pageIndex).subscribe(response => {
      expect(response).toEqual(mockPaginatedResponse);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockPaginatedResponse);
  });

  it('should search manufacturers by name', () => {
    const name = 'Test';
    const pageSize = 10;
    const pageIndex = 0;
    const url = `${environment.BASE_URL}${environment.MANUFACTURERS_ENDPOINT_BY_NAME}?nome=${name}&pageSize=${pageSize}&initialPage=${pageIndex}`;

    service.searchManufacturersByName(name, pageSize, pageIndex).subscribe(response => {
      expect(response).toEqual(mockPaginatedResponse);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockPaginatedResponse);
  });

  it('should search manufacturers by CNPJ', () => {
    const cnpj = '12345678000195';
    const pageSize = 10;
    const pageIndex = 0;
    const url = `${environment.BASE_URL}${environment.MANUFACTURERS_ENDPOINT}/${cnpj}?&pageSize=${pageSize}&initialPage=${pageIndex}`;

    service.searchManufacturersByCNPJ(cnpj, pageSize, pageIndex).subscribe(response => {
      expect(response).toEqual(mockPaginatedResponse);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockPaginatedResponse);
  });

  it('should create a manufacturer', () => {
    const url = `${environment.BASE_URL}${environment.MANUFACTURERS_ENDPOINT}`;

    service.createManufacturer(mockManufacturer).subscribe(response => {
      expect(response).toEqual(mockManufacturer);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockManufacturer);
    req.flush(mockManufacturer);
  });

  it('should edit a manufacturer', () => {
    const url = `${environment.BASE_URL}${environment.MANUFACTURERS_ENDPOINT}`;

    service.editManufacturer(mockManufacturer).subscribe(response => {
      expect(response).toEqual(mockManufacturer);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockManufacturer);
    req.flush(mockManufacturer);
  });

  it('should delete a manufacturer', () => {
    const id = '1';
    const url = `${environment.BASE_URL}${environment.MANUFACTURERS_ENDPOINT}/${id}`;

    service.deleteManufacturer(id).subscribe(response => {
      expect(response).toEqual(mockManufacturer);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockManufacturer);
  });
});
