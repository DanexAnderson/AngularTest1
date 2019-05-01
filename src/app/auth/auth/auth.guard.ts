import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthGuard implements CanActivate {
  path: ActivatedRouteSnapshot[];
  route: ActivatedRouteSnapshot;

constructor (private authService: AuthService, private router: Router) {}

 canActivate(route: ActivatedRouteSnapshot, path: ActivatedRouteSnapshot, state: RouterStateSnapshot):
 boolean | Observable<boolean> | Promise<boolean> {

  const isAuth = this.authService.getIsAuth();
  if (!isAuth) {

      this.router.navigate(['/auth/signin']);
  }
  return isAuth;

  }

}

// Protects Against HTML injections...
// Routes Protections
