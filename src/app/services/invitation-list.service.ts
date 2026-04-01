import { Injectable } from '@angular/core';
import { ApiCallModel } from '../models/base/apiCallModel';
import { ApiHelperService } from '../shared/api-helper.service';

@Injectable({
  providedIn: 'root',
})
export class InvitationListService {
  constructor(private service: ApiHelperService) {}

  getInvitations(provinceId: number,zoneId:number) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'InvitationList/GetPartySecretaryInvitations';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = {provinceId,zoneId};
    return this.service.post(apiCallModel);
  }
  getInvitationStatusHistory(invitationId: number) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'InvitationList/GetInvitationStatusHistory';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = { invitationId };
    return this.service.post(apiCallModel);
  }
}
