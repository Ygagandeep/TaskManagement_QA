import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api';

@Injectable({ providedIn: 'root' })
export class AccessService {
  constructor(private http: HttpClient) {}
  list() { return this.http.get<any[]>(`${API_URL}/access`); }
  update(userId: string, data: unknown) { return this.http.put(`${API_URL}/access/${userId}`, data); }
}
