import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient) {}
  list() { return this.http.get<any[]>(`${API_URL}/notifications`); }
  unreadCount() { return this.http.get<{ count: number }>(`${API_URL}/notifications/unread-count`); }
  read(id: string) { return this.http.put(`${API_URL}/notifications/${id}/read`, {}); }
  delete(id: string) { return this.http.delete(`${API_URL}/notifications/${id}`); }
  clear() { return this.http.delete(`${API_URL}/notifications/clear`); }
}
