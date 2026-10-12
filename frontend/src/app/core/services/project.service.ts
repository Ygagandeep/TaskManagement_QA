import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private http: HttpClient) {}
  list() { return this.http.get<any[]>(`${API_URL}/projects`); }
  create(data: unknown) { return this.http.post(`${API_URL}/projects`, data); }
  updateStatus(id: string, data: unknown) { return this.http.put(`${API_URL}/projects/${id}/status`, data); }
  delete(id: string) { return this.http.delete(`${API_URL}/projects/${id}`); }
}
