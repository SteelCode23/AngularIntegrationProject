import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { ELogStationAuthService } from './elogstationauth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    public eLogStationAuthService: ELogStationAuthService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log('yes');
    console.log(this.authService.isSignedIn);
    console.log(this.eLogStationAuthService.isSignedIn);
    if (this.authService.isSignedIn) {
      if (this.eLogStationAuthService.isSignedIn) {
        return true;
      }
    }
    // this.router.navigate(['/']);
    return false;
  }

}
