import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Manufacturer } from '../models/manufacturer';
import { environment } from '../../../../environments/environment.development';
import { PaginatedResponse } from '../../../shared/models/paginated-response';
import { isInteger } from '../../../shared/utils/utils';

@Injectable({
  providedIn: 'root'
})
export class ManufacturersService {

  private base_url: string = environment.BASE_URL;
  private list_endpoint: string = environment.MANUFACTURERS_ENDPOINT;
  private search_endpoint: string = environment.MANUFACTURERS_ENDPOINT_BY_NAME;

  constructor(private http: HttpClient) { }

  public getManufacturers(pageSize: number = 10, pageIndex: number = 0, name?: string): Observable<PaginatedResponse<Manufacturer>> {
    const url = this.buildListUrl(pageSize, pageIndex, name);

    return this.http.get<PaginatedResponse<Manufacturer>>(url);
  }

  private buildListUrl(pageSize: number = 10, pageIndex: number = 0, name?: string): string {
    const nameParam: string = `nome=${name}`;
    const pageSizeParam: string = `pageSize=${pageSize}`;
    const pageIndexParam: string = `initialPage=${pageIndex}`;

    if (!name) {
      return `${this.base_url}${this.list_endpoint}?&${pageSizeParam}&${pageIndexParam}`;
    }

    if (name.length === 14 && isInteger(name)) {
      return `${this.base_url}${this.list_endpoint}/${name}?&${pageSizeParam}&${pageIndexParam}`;
    }

    return `${this.base_url}${this.search_endpoint}?${nameParam}&${pageSizeParam}&${pageIndexParam}`;
  }
}
