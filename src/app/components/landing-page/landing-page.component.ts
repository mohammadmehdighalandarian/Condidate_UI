import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginResponseModel } from 'src/app/models/authentication/TokenAndResponseModel';
import { ApiDataResponse } from 'src/app/models/base/apiDataRseponseModel';
import { SSOService } from 'src/app/shared/SSO.service';
import { AfterLoginService } from 'src/app/shared/after.login.service';
import { AuthService } from 'src/app/shared/auth.service';
import { MessageService } from 'src/app/shared/message.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  token: string;

  code: string;
  state: string;
  logingIn: boolean = false;
  constructor(
    private authService: AuthService,
    private ssoService: SSOService,
    private afterService: AfterLoginService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    route.queryParams.subscribe((val) => {
      this.code = val['code'];
      this.state = val['state'];
      // this.token = val['token'];
    });
  }

  ngOnInit(): void {

    if (this.code && this.state) {
      this.logingIn = true;
      this.afterService.GetToken(this.code, this.state)
        .then((result: ApiDataResponse<LoginResponseModel>) => {

          if(result.data.hasMultiLogin){
            this.router.navigate(['/selectRole/'+result.data.tempToken]);
            return;
          }

          localStorage.setItem('access_token', result.data.token.accessToken);
          this.authService.currentUser = result.data;
          localStorage.setItem('CurrentUser', JSON.stringify(
            this.authService.currentUser
          ))
          this.router.navigate(['/mainPage']);
        })
        .catch((error) => {
          this.messageService.showErrorSweetAlert('لطفا دقایقی دیگر مجددا تلاش نمایید', 'خطا در دریافت اطلاعات!')
            .then((res) => {
              this.ssoService.logoutSSO()
                .then((result) => {
                  this.authService.logOut();
                })
                .catch((error) => {
                });

            })

        })
    }

  }
  enterApplication() {
    this.ssoService.loginSso()
      .then((result: ApiDataResponse<string>) => {
        window.location.href = result.data;
      })
      .catch((error) => {
      })
  }
}
