import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiOptionsService {
  constructor(private authService: AuthService) {}

  getOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Authorization: 'Bearer ' + this.authService.getToken(),
      }),
    };
  }
}

export class InterceptorMetaOptions {
  constructor(
    public skipIncerceptor: boolean = false,
    public skipJson: boolean = false,
    public skipAuthorization: boolean = false
  ) {}
}
