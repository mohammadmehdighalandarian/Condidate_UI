import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectRoleModel } from 'src/app/models/authentication/SelectRoleModel';
import { LoginResponseModel } from 'src/app/models/authentication/TokenAndResponseModel';
import { ApiDataResponse } from 'src/app/models/base/apiDataRseponseModel';
import { AfterLoginService } from 'src/app/shared/after.login.service';
import { AuthService } from 'src/app/shared/auth.service';
import { MessageService } from 'src/app/shared/message.service';
import { SSOService } from 'src/app/shared/SSO.service';

@Component({
  selector: 'app-select-role',
  templateUrl: './select-role.component.html',
  styleUrls: ['./select-role.component.css']
})


export class SelectRoleComponent implements OnInit {

  code: string;
  roles: number[];
  

  constructor(
    private authService: AuthService,
    private afterLoginService: AfterLoginService,
    private ssoService: SSOService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
    debugger;
     this.code = route.snapshot.paramMap.get('code');
    // route.queryParams.subscribe((val) => {
    //   this.code = val['code'];
    // });
  }

  ngOnInit(): void {
    if (this.code) {
      // get available user logins and generate cards for each login
      this.afterLoginService.GetAvailableRoles(this.code)
        .then((result: ApiDataResponse<number[]>) => {
          this.roles = result.data;
        })
    }
  }


  selectLogin(roleId : number) {
    let model  = new SelectRoleModel();
    model.code = this.code;
    model.roleId = roleId;
    this.afterLoginService.SelectRole(model)
    .then((result : ApiDataResponse<LoginResponseModel>)=>{
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
