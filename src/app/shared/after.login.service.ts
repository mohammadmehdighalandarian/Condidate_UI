import { Injectable } from '@angular/core';

import { ApiCallModel } from '../models/base/apiCallModel';
import { ApiHelperService } from '../shared/api-helper.service';
import { SelectRoleModel } from '../models/authentication/SelectRoleModel';

@Injectable({
  providedIn: 'root',
})
export class AfterLoginService {
  constructor(private service: ApiHelperService) { }

  GetToken(code: String, state: string) {
    let apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Account/GetToken?code='+code+'&state='+state;
    apiCallModel.showErrorAlert = true;
    apiCallModel.showNoDataAlert = true;
    apiCallModel.resolveAfterMessage = true;
    return this.service.get(apiCallModel);

  }

  GetAvailableRoles(code: string){
    let apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Account/GetAvailableRoles?code='+code;
    apiCallModel.showErrorAlert = true;
    apiCallModel.showNoDataAlert = true;
    apiCallModel.resolveAfterMessage = true;
    //apiCallModel.showLoading = true;
    return this.service.get(apiCallModel);
  }

  SelectRole(model:SelectRoleModel){
    let apiCallModel = new ApiCallModel();
    apiCallModel.data = model;
    apiCallModel.url = 'Account/SelectRoleAfterLogin';
    apiCallModel.showErrorAlert = true;
    apiCallModel.resolveAfterMessage = true;
    return this.service.post(apiCallModel)
  }
  // AfterLoginSso() {
  //   let apiCallModel = new ApiCallModel();
  //   apiCallModel.url = 'Account/LoginSSOAfterCallback';
  //   apiCallModel.showNoDataAlert = true;
  //   return this.service.get(apiCallModel);

  // }
}
