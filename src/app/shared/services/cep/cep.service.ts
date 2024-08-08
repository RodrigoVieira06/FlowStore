import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Cep } from '../../models/cep';

@Injectable({
  providedIn: 'root'
})
export class CepService {

  private readonly base_url: string = environment.VIACEP_URL;

  constructor(private http: HttpClient) { }

  public getAddress(cep: string): Observable<Cep> {
    const url = `${this.base_url}/${cep}/json/`;

    return this.http.get<Cep>(url);
  }
}
