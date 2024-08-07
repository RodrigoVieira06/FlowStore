import { TestBed } from '@angular/core/testing';

import { ProductsService } from './products.service';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { PaginatedResponse } from '../../../shared/models/paginated-response';
import { Product } from '../models/product';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
  const pageSize = 10;
  const pageIndex = 0;

  const mockProduct: Product = {
    "nome": "Coca-Cola2",
    "descricao": "Com sabor inconfundível e único, uma Coca-Cola Original é o refrigerante mais tradicional econsumido no mundo inteiro! Toda Coca-Cola Original é especialmente concebido para manter sempre a qualidade do melhor sabor de refrigerante! É perfeita para compartilhar os melhores momentos da vida com amigos e familiaresa!",
    "codigoBarras": "7894900011712",
    "fabricanteID": 72
  }

  const mockPaginatedResponse: PaginatedResponse<Product> = {
    content: [mockProduct],
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
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products', () => {
    const url = `${environment.BASE_URL}${environment.PRODUCTS_ENDPOINT}?&pageSize=${pageSize}&initialPage=${pageIndex}`;

    service.getProducts(pageSize, pageIndex).subscribe(response => {
      expect(response).toEqual(mockPaginatedResponse);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockPaginatedResponse);
  });

  it('should search products by barcode', () => {
    const barcode = '1234567890123';
    const pageSize = 10;
    const pageIndex = 0;
    const url = `${environment.BASE_URL}${environment.PRODUCTS_ENDPOINT}/${barcode}?pageSize=${pageSize}&initialPage=${pageIndex}`;

    service.searchProductsByBarcode(barcode, pageSize, pageIndex).subscribe(response => {
      expect(response).toEqual(mockPaginatedResponse);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockPaginatedResponse);
  });

  it('should create a product', () => {
    const url = `${environment.BASE_URL}${environment.PRODUCTS_ENDPOINT}`;

    service.createProduct(mockProduct).subscribe(response => {
      expect(response).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockProduct);
  });

  it('should edit a product', () => {
    const url = `${environment.BASE_URL}${environment.PRODUCTS_ENDPOINT}`;

    service.editProduct(mockProduct).subscribe(response => {
      expect(response).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockProduct);
  });

  it('should delete a product', () => {
    const id = '1';
    const url = `${environment.BASE_URL}${environment.PRODUCTS_ENDPOINT}/${id}`;

    service.deleteProduct(id).subscribe(response => {
      expect(response).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockProduct);
  });
});
