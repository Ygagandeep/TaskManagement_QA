import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from './api';

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient) {}
  list(filters: Record<string, string> = {}) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => { if (value) params = params.set(key, value); });
    return this.http.get<any[]>(`${API_URL}/tasks`, { params });
  }
  create(data: unknown) { return this.http.post(`${API_URL}/tasks`, data); }
  updateStatus(id: string, data: unknown) { return this.http.put(`${API_URL}/tasks/${id}/status`, data); }
  delete(id: string) { return this.http.delete(`${API_URL}/tasks/${id}`); }
}
