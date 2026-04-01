import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
//import { environment } from '../enviroments/environment.prod';
import { environment } from '../enviroments/environment';
import { LoginResponseModel } from '../models/authentication/TokenAndResponseModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser: LoginResponseModel; //UserLoginModel = new UserLoginModel() ; // Observable<UserLogin> = new Observable<UserLogin>();
  redirectUrl: string | undefined;

  constructor(private router: Router, private http: HttpClient,) { }

  get thisUser() {
    return this.currentUser; //todo .asObservable();
  }
  getToken() {
    return localStorage.getItem('access_token');
  }

  setToken(token: string) {
    localStorage.setItem('access_token', token);
  }
  logOut() {
    this.clearLocalStorageAndCurrentUser();
  }

  clearLocalStorageAndCurrentUser() {
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('CurrentUser');
    this.currentUser = new LoginResponseModel();
    setTimeout(() => {
      window.location.href = environment.logoutUrl;
    }, 100);
    // this.router.navigate(['login-url-todo']);
  }

  loggedIn() {
    return localStorage.getItem('access_token') != undefined;
  }

  isTokenValid() {
    let token = localStorage.getItem('access_token')!;
    if (!token) {
      return false;
    }
    let expiry = JSON.parse(atob(token.split('.')[1])).exp;
    if (!Math.floor(new Date().getTime() / 1000) >= expiry) {
      return false;
    }
    return true;
  }

  getCurrentUser() {
    try {
      this.currentUser = JSON.parse(localStorage.getItem('CurrentUser')!);
      if (this.currentUser == null && environment.bypassLoginForDevelopment) {
        this.currentUser = {
          token: { accessToken: '', expiresIn: 0 },
          code: '',
          firstName: 'Dev',
          lastName: 'User',
          fullName: 'Development User',
          provinceTitle: '-',
          zoneTitle: '-',
          profileImage: '',
          phoneNumber: '',
        } as LoginResponseModel;
        localStorage.setItem('CurrentUser', JSON.stringify(this.currentUser));
      }

      if (this.currentUser == null) {
        this.logOut();
      }
      return this.currentUser;
    } catch (error) {
      if (environment.bypassLoginForDevelopment) {
        this.currentUser = {
          token: { accessToken: '', expiresIn: 0 },
          code: '',
          firstName: 'Dev',
          lastName: 'User',
          fullName: 'Development User',
          provinceTitle: '-',
          zoneTitle: '-',
          profileImage: '',
          phoneNumber: '',
        } as LoginResponseModel;
        localStorage.setItem('CurrentUser', JSON.stringify(this.currentUser));
        return this.currentUser;
      }

      this.logOut();
    }
  }
}
