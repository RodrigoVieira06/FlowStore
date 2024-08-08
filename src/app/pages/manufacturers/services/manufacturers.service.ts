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
  private readonly base_url: string = environment.BASE_URL;
  private readonly main_endpoint: string = environment.MANUFACTURERS_ENDPOINT;
  private readonly search_endpoint: string = environment.MANUFACTURERS_ENDPOINT_BY_NAME;

  constructor(private http: HttpClient) { }

  public getManufacturers(pageSize: number = 10, pageIndex: number = 0): Observable<PaginatedResponse<Manufacturer>> {
    const pageSizeParam: string = `pageSize=${pageSize}`;
    const pageIndexParam: string = `initialPage=${pageIndex}`;

    const url = `${this.base_url}${this.main_endpoint}?&${pageSizeParam}&${pageIndexParam}`;

    return this.http.get<PaginatedResponse<Manufacturer>>(url);
  }

  public searchManufacturersByName(name: string, pageSize: number = 10, pageIndex: number = 0): Observable<PaginatedResponse<Manufacturer>> {
    const nameParam: string = `nome=${name}`;
    const pageSizeParam: string = `pageSize=${pageSize}`;
    const pageIndexParam: string = `initialPage=${pageIndex}`;

    const url = `${this.base_url}${this.search_endpoint}?${nameParam}&${pageSizeParam}&${pageIndexParam}`;

    return this.http.get<PaginatedResponse<Manufacturer>>(url);
  }

  public searchManufacturersByCNPJ(cnpj: string, pageSize: number = 10, pageIndex: number = 0): Observable<PaginatedResponse<Manufacturer>> {
    const pageSizeParam: string = `pageSize=${pageSize}`;
    const pageIndexParam: string = `initialPage=${pageIndex}`;

    const url = `${this.base_url}${this.main_endpoint}/${cnpj}?&${pageSizeParam}&${pageIndexParam}`;

    return this.http.get<PaginatedResponse<Manufacturer>>(url);
  }

  public createManufacturer(entity: Manufacturer): Observable<Manufacturer> {
    const url = this.base_url + this.main_endpoint;

    return this.http.post<Manufacturer>(url, entity);
  }

  public editManufacturer(entity: Manufacturer): Observable<Manufacturer> {
    const url = this.base_url + this.main_endpoint;

    return this.http.put<Manufacturer>(url, entity);
  }

  public deleteManufacturer(id: string): Observable<Manufacturer> {
    const url = this.base_url + this.main_endpoint + '/' + id;

    return this.http.delete<Manufacturer>(url);
  }
}
