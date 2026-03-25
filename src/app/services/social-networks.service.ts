import { Injectable } from '@angular/core';
import { ApiCallModel } from '../models/base/apiCallModel';
import { SocialNetworks } from '../models/socialNetworksModel';
import { ApiHelperService } from '../shared/api-helper.service';

@Injectable({
  providedIn: 'root',
})
export class SocialNetworksService {
  constructor(private service: ApiHelperService) {}

  getSocialNetworks() {
    let apiCallModel = new ApiCallModel();
    apiCallModel.url = 'SocialNetwork/GetSocialData';
    apiCallModel.showSuccessAlert = false;
    return this.service.post(apiCallModel);
  }

  addSocialNetwork(model: SocialNetworks) {
    let apiCallModel = new ApiCallModel();
    apiCallModel.url = 'SocialNetwork/SaveSocialData';
    apiCallModel.showSuccessAlert = true;
    apiCallModel.data = model;
    return this.service.post(apiCallModel);
  }

  deleteSocialNetwork(model: SocialNetworks) {
    var apiModel = new ApiCallModel();
    apiModel.url = 'SocialNetwork/DeleteSocialData';
    apiModel.data = model.id;
    apiModel.showSuccessAlert = true;
    apiModel.showConfirmAlert = true;
    apiModel.confirmAlertText =
      'ورودی انتخاب شده حذف خواهد شد.<br><strong class="text-danger"></strong><br>آیا مطمئن هستید؟';
    return this.service.post(apiModel);
  }
  
}

