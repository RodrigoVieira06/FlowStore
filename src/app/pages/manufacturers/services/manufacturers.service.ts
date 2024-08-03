import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Manufacturer } from '../models/manufacturer';
import { environment } from '../../../../environments/environment.development';
import { PaginatedResponse } from '../../../shared/models/paginated-response';

@Injectable({
  providedIn: 'root'
})
export class ManufacturersService {

  private base_url: string = environment.BASE_URL;
  private main_endpoint: string = environment.MANUFACTURERS_ENDPOINT;
  private search_endpoint: string = environment.MANUFACTURERS_ENDPOINT_BY_NAME;

  constructor(private http: HttpClient) { }

  public getManufacturers(pageSize: number = 10, pageIndex: number = 0): Observable<PaginatedResponse<Manufacturer>> {
    const pageSizeParam: string = `pageSize=${pageSize}`;
    const pageIndexParam: string = `initialPage=${pageIndex}`;

    const url = `${this.base_url}${this.main_endpoint}?&${pageSizeParam}&${pageIndexParam}`;

    return this.http.get<PaginatedResponse<Manufacturer>>(url);
  }

  public searchByNameManufacturers(pageSize: number = 10, pageIndex: number = 0, name?: string): Observable<PaginatedResponse<Manufacturer>> {
    const nameParam: string = `nome=${name}`;
    const pageSizeParam: string = `pageSize=${pageSize}`;
    const pageIndexParam: string = `initialPage=${pageIndex}`;

    const url = `${this.base_url}${this.search_endpoint}?${nameParam}&${pageSizeParam}&${pageIndexParam}`;

    return this.http.get<PaginatedResponse<Manufacturer>>(url);
  }

  public searchByCNPJManufacturers(pageSize: number = 10, pageIndex: number = 0, cnpj?: string): Observable<PaginatedResponse<Manufacturer>> {
    const pageSizeParam: string = `pageSize=${pageSize}`;
    const pageIndexParam: string = `initialPage=${pageIndex}`;

    const url = `${this.base_url}${this.main_endpoint}/${cnpj}?&${pageSizeParam}&${pageIndexParam}`;

    return this.http.get<PaginatedResponse<Manufacturer>>(url);
  }


  public deleteManufacturers(id: string): Observable<Manufacturer> {
    const url = this.base_url + this.main_endpoint + '/' + id;

    return this.http.delete<Manufacturer>(url);
  }
}
