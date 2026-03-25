import { Injectable } from '@angular/core';
import { ApiCallModel } from '../models/base/apiCallModel';
import { ApiHelperService } from './api-helper.service';
// import { StaticPageRoutes } from './static-page-routes';

@Injectable({
  providedIn: 'root',
})
export class SSOService {
  constructor(private apiHelper: ApiHelperService) { }

  loginSso() {
    debugger;
    var apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Account/LoginBeforeSso';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.resolveAfterMessage = true;
    console.log(this.apiHelper.get(apiCallModel));
    
    return this.apiHelper.get(apiCallModel);

  }

  logoutSSO() {
    var apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Account/Logout';
    apiCallModel.showSuccessAlert = false;
    return this.apiHelper.get(apiCallModel)
  }


}
