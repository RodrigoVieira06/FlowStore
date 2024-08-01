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
  private endpoint: string = environment.MANUFACTURERS_ENDPOINT;

  constructor(private http: HttpClient) { }

  public listManufactures(pageSize: number = 10, pageIndex: number = 0): Observable<PaginatedResponse<Manufacturer>> {
    const url = `${this.base_url}${this.endpoint}?pageSize=${pageSize}&initialPage=${pageIndex}`;

    return this.http.get<PaginatedResponse<Manufacturer>>(url);
  }
}
