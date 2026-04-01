import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiDataResponse } from '../models/base/apiDataRseponseModel';
import { AcceptLawsService } from '../services/accept-laws.service';
import { AuthService } from '../shared/auth.service';
import { environment } from '../enviroments/environment';

@Injectable()
export class authGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private jwtHelper: JwtHelperService,
    private acceptLawsService: AcceptLawsService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    try {
      if (environment.bypassLoginForDevelopment) {
        return true;
      }

      this.authService.redirectUrl = state.url;
      if (
        (!this.authService.loggedIn() &&
          this.jwtHelper.isTokenExpired(this.authService.getToken()!)


        ) || this.tokenExpired(this.authService.getToken()!)
      ) {
        // if (state.url.includes('landing')) {
        //   this.router.navigate([state.url]);
        // }
        this.router.navigateByUrl('/landing');

        return false;
      } else {
        let currentUser =  JSON.parse(localStorage.getItem('CurrentUser'))
        if(currentUser && currentUser.roleId != 1){
          return true;
        }
        this.acceptLawsService
          .checkLawAcceptance()
          .then((result: ApiDataResponse<boolean>) => {
            if (!result.data) {
              this.router.navigate(['/AcceptLaws']);
              return false;
            }
            return true;
          })
          .catch((error) => {
            return false;
          });
      }
    } catch (error) {
      localStorage.clear();
      return false;
    }
  }

  private tokenExpired(token: string): boolean {
    try {
      const expiry = JSON.parse(atob(token.split('.')[1])).exp;
      return Math.floor(new Date().getTime() / 1000) >= expiry;
    } catch (error) {
      localStorage.clear();
      return true;
    }
  }
}
