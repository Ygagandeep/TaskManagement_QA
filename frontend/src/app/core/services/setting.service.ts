import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from './api';

@Injectable({ providedIn: 'root' })
export class SettingService {
  constructor(private http: HttpClient) {}
  get() { return this.http.get<any>(`${API_URL}/settings`); }
  save(data: unknown) { return this.http.put(`${API_URL}/settings`, data); }
  profile(data: unknown) { return this.http.put(`${API_URL}/settings/profile`, data); }
  password(data: unknown) { return this.http.put(`${API_URL}/settings/password`, data); }
  deleteAccount(password: string) { return this.http.delete(`${API_URL}/settings/account`, { body: { password } }); }
}
