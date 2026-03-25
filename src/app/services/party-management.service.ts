import { Injectable } from '@angular/core';
import { ApiCallModel } from '../models/base/apiCallModel';
import { ApiHelperService } from '../shared/api-helper.service';

@Injectable({
  providedIn: 'root',
})
export class PartyManagementService {
  constructor(private api: ApiHelperService) {}

  addToPublicationList(model) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'PartyList/AddToPublicationList';
    apiCallModel.showSuccessAlert = true;
    apiCallModel.data = model;
    return this.api.post(apiCallModel);
  }

  changeRankBeforeSend(model) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'PartyList/ChangeRankBeforeSend';
    apiCallModel.data = model;
    return this.api.post(apiCallModel);
  }

  getInvitationList(filter) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'PartyList/GetInvitationList';
    apiCallModel.data = filter;
    return this.api.post(apiCallModel);
  }

  sendInvitationList(model) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'PartyList/SendInvitationList';
    apiCallModel.showSuccessAlert = true;
    apiCallModel.data = model;
    return this.api.post(apiCallModel);
  }
  
}
