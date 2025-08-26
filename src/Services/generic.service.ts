import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiDefaults } from '../Tools/projectenviorment';

@Injectable({
  providedIn: 'root'
})
export class GenericService {

  baseURL: string = ApiDefaults.apiUrl;
  constructor(private service: HttpClient) { }

  Post(endpoint: string, data: any) {
    return this.service.post(this.baseURL + endpoint, data, { withCredentials: true });
  }

  Get(endpoint: string) {
    return this.service.get(this.baseURL + endpoint, { withCredentials: true });
  }
}
