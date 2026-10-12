import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


//Is this logged-in user allowed to access this particular page?

export const accessGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const key = route.data['accessKey'] as string;
  if (auth.canOpen(key)) return true;
  router.navigate(['/dashboard']);
  return false;
};
