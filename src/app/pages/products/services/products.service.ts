import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../../../shared/models/paginated-response';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private base_url: string = environment.BASE_URL;
  private main_endpoint: string = environment.PRODUCTS_ENDPOINT;

  constructor(private http: HttpClient) { }

  public getProducts(pageSize: number = 10, pageIndex: number = 0): Observable<PaginatedResponse<Product>> {
    const pageSizeParam: string = `pageSize=${pageSize}`;
    const pageIndexParam: string = `initialPage=${pageIndex}`;

    const url = `${this.base_url}${this.main_endpoint}?&${pageSizeParam}&${pageIndexParam}`;

    return this.http.get<PaginatedResponse<Product>>(url);
  }

  public searchProductsByBarcode(code: string, pageSize: number = 10, pageIndex: number = 0): Observable<PaginatedResponse<Product>> {
    const pageSizeParam: string = `pageSize=${pageSize}`;
    const pageIndexParam: string = `initialPage=${pageIndex}`;

    const url = `${this.base_url}${this.main_endpoint}/${code}?${pageSizeParam}&${pageIndexParam}`;

    return this.http.get<PaginatedResponse<Product>>(url);
  }

  public createProduct(entity: Product): Observable<Product> {
    const url = this.base_url + this.main_endpoint;

    return this.http.post<Product>(url, entity);
  }

  public editProduct(entity: Product): Observable<Product> {
    const url = this.base_url + this.main_endpoint;

    return this.http.put<Product>(url, entity);
  }

  public deleteProduct(id: string): Observable<Product> {
    const url = this.base_url + this.main_endpoint + '/' + id;

    return this.http.delete<Product>(url);
  }
}
