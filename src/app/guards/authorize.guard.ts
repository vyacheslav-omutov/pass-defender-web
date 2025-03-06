import { CanActivateFn, Router } from '@angular/router';
import { AuthorizationService } from '../services/authorization.service';
import { inject } from '@angular/core';

export const authorizeGuard: CanActivateFn = () => {
  const authorizationService = inject(AuthorizationService)
  const router = inject(Router);

  let isAuthenticated = authorizationService.isAuthenticated;
  if (!isAuthenticated) {
    router.navigate(['/login']).then();
  }

  return isAuthenticated;
};
