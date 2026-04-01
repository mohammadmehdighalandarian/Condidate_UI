import { Injectable } from '@angular/core';
import { ApiCallModel } from '../models/base/apiCallModel';
import { ApiHelperService } from '../shared/api-helper.service';

@Injectable({
  providedIn: 'root',
})
export class PoliticalStatusService {
  constructor(private service: ApiHelperService) {}

  getCandidateInvitations() {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'PoliticalStatus/GetCandidateInvitations';
    apiCallModel.showSuccessAlert = false;
    return this.service.get(apiCallModel);
  }
  getCandidateParty() {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'PoliticalStatus/GetCandidateParty';
    apiCallModel.showSuccessAlert = false;
    return this.service.get(apiCallModel);
  }
  changeInvitationStatus(model) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'PoliticalStatus/ChangeInvitationStatus';
    apiCallModel.showSuccessAlert = true;
    apiCallModel.data = model;
    return this.service.post(apiCallModel);
    }

   getInvitationStatusHistory(invitationId:number) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'PoliticalStatus/GetInvitationStatusHistory';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = {invitationId};
    return this.service.post(apiCallModel);
  }
}
