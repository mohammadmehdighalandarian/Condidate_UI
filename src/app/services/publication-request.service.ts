import { Injectable } from '@angular/core';
import { ApiCallModel } from '../models/base/apiCallModel';
import { ApiHelperService } from '../shared/api-helper.service';

@Injectable({
  providedIn: 'root',
})
export class PublicationRequestService {
  constructor(private service: ApiHelperService) {}

  getPublicationRequests(term: string = '') {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'PartyList/GetPublicationLists';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = { term };
    return this.service.post(apiCallModel);
  }

  getPublicationRequestCandidates(publicationListId:number) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'PartyList/GetPartyCandidates';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = { publicationListId };
    return this.service.post(apiCallModel);
  }
}
