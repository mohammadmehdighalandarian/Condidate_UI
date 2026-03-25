import { Component, OnInit } from '@angular/core';
import { LoginResponseModel } from 'src/app/models/authentication/TokenAndResponseModel';
import { SSOService } from 'src/app/shared/SSO.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.css']
})
export class TopNavBarComponent implements OnInit {
  userInfo: LoginResponseModel;
  constructor(
    private authService: AuthService,
    private ssoService: SSOService
  ) { }
  ngOnInit(): void {
    this.userInfo = this.authService.getCurrentUser();
  }
  Logout() {
    this.ssoService.logoutSSO()
      .then((result) => {
        this.authService.logOut();
      })
      .catch((error) => {

      });
  }
}
