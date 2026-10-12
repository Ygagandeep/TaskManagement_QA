import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from './api';

@Injectable({ providedIn: 'root' })

export class EmployeeService {
  constructor(private http: HttpClient) {}
  list(filters: Record<string, string> = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => { if (value) params = params.set(key, value); });
    return this.http.get<any[]>(`${API_URL}/users`, { params });
  }
  create(data: unknown) { return this.http.post(`${API_URL}/users`, data); }
  updateRole(id: string, role: string) { return this.http.put(`${API_URL}/users/${id}/role`, { role }); }
  updateStatus(id: string, status: string) { return this.http.put(`${API_URL}/users/${id}/status`, { status }); }
  delete(id: string) { return this.http.delete(`${API_URL}/users/${id}`); }
}
