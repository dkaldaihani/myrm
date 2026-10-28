import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Customer {
  id: number;
  customerNumber: number;
  name: string;
  dateOfBirth: string;
  gender: string;
}

export interface CustomerData {
  name: string;
  dateOfBirth: string;
  gender: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly apiUrl = 'http://localhost:3000/customers';

  constructor(private readonly http: HttpClient) {}

  getAll() {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  create(data: CustomerData) {
    return this.http.post<Customer>(this.apiUrl, data);
  }

  update(id: number, data: CustomerData) {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, data);
  }
}
