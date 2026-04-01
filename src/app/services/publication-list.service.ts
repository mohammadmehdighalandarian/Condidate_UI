import { Injectable } from '@angular/core';
import { ApiCallModel } from '../models/base/apiCallModel';
import { ApiHelperService } from '../shared/api-helper.service';

@Injectable({
  providedIn: 'root',
})
export class PublicationListService {
  constructor(private service: ApiHelperService) {}

  getPublicationLists() {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'PublicationList/GetAllPublicationLists';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.showLoading = true;
    return this.service.get(apiCallModel);
  }
}
