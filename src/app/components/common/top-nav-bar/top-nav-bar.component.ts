import { Component, OnInit } from '@angular/core';
import { LoginResponseModel } from 'src/app/models/authentication/TokenAndResponseModel';
import { ApiDataResponse } from 'src/app/models/base/apiDataRseponseModel';
import { siteInfo } from 'src/app/models/siteInfo';
import { CommonService } from 'src/app/services/common.service';
import { SSOService } from 'src/app/shared/SSO.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.css']
})
export class TopNavBarComponent implements OnInit {
  userInfo: LoginResponseModel;
  //readonly candidateListPublishDeadline = environment.partyList.candidateListPublishDeadline;
  candidateListPublishDeadline : string;
  constructor(
    private authService: AuthService,
    private ssoService: SSOService,
    private siteInfoService: CommonService,
  ) { }
  ngOnInit(): void {
    this.userInfo = this.authService.getCurrentUser();
    this.siteInfoService.getSiteInfo().then((result:ApiDataResponse<siteInfo[]>) => {
      let siteInfoPublishDeadline = result.data.filter(x=>x.key == 1)[0];
      this.siteInfoService.siteInfo.next(siteInfoPublishDeadline);
      this.candidateListPublishDeadline = siteInfoPublishDeadline.value;
    });
  }
  Logout() {
    this.authService.logOut();

    this.ssoService.logoutSSO();
  }
}
