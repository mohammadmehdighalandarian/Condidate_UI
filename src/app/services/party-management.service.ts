import { Injectable } from '@angular/core';
import { ApiCallModel } from '../models/base/apiCallModel';
import { ApiHelperService } from '../shared/api-helper.service';
import { cancelInvitation } from '../models/partyList/Invitation/cancelInvitation';
import { deleteInvitation } from '../models/partyList/Invitation/deleteInvitation';

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
    apiCallModel.url = 'PartyList/GetInvitationListForParty';
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
  
  cancelInvitation(model: cancelInvitation) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'PartyList/CancelInvitation';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = model;
    return this.api.post(apiCallModel);
  }
  deleteInvitation(model: deleteInvitation) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'PartyList/DeleteInvitation';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = model;
    return this.api.post(apiCallModel);
  }

  sendPublicationRequest(model) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'PartyList/SendPublicationList';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = model;
    return this.api.post(apiCallModel);
  }
}
