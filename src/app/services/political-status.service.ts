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
}

