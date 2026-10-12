import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if (!token) return next(req);
  const viewRole = localStorage.getItem('viewRole') || '';
  return next(req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      'X-View-Role': viewRole
    }
  }));
};
