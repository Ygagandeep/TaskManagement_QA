import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from './api';

@Injectable({ providedIn: 'root' })
export class FileService {
  constructor(private http: HttpClient) {}
  list(search = '', type = 'all') {
    const params = new HttpParams().set('search', search).set('type', type);
    return this.http.get<any[]>(`${API_URL}/files`, { params });
  }
  upload(formData: FormData) { return this.http.post(`${API_URL}/files/upload`, formData); }
  delete(id: string) { return this.http.delete(`${API_URL}/files/${id}`); }
}
