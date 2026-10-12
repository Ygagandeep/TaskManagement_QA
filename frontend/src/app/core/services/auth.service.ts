import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_URL, Access, User } from './api';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  register(data: unknown) {
    return this.http.post(`${API_URL}/auth/register`, data);
  }

  login(data: unknown): Observable<{ token: string; user: User; access: Access }> {
    return this.http.post<{ token: string; user: User; access: Access }>(`${API_URL}/auth/login`, data).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('access', JSON.stringify(res.access || {}));
        localStorage.setItem('viewRole', res.user.role);
      })
    );
  }

  isLoggedIn() {
    return Boolean(localStorage.getItem('token'));
  }

  currentUser(): User | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  hasAccess(key: string) {
    const raw = localStorage.getItem('access');
    const access = raw ? JSON.parse(raw) : {};
    const value = access?.[key];
    return value === true || value === 'true';
  }

  viewRole(): 'admin' | 'user' {
    const role = (localStorage.getItem('viewRole') || this.currentUser()?.role || 'user').toLowerCase().trim();
    return role === 'admin' ? 'admin' : 'user';
  }

  setViewRole(role: 'admin' | 'user') {
    localStorage.setItem('viewRole', role.toLowerCase().trim());
  }

  canOpen(key: string) {
    const userRole = (this.currentUser()?.role || '').toLowerCase().trim();
    const adminOnlyKeys = ['employeeManagement', 'accessManagement'];
    if (userRole === 'admin') return true;
    if (adminOnlyKeys.includes(key)) return false;
    return this.hasAccess(key);
  }

  isAdmin() {
    return (this.currentUser()?.role || '').toLowerCase().trim() === 'admin';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
