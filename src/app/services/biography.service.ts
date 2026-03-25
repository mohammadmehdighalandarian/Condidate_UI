import { Injectable } from '@angular/core';

import { ApiCallModel } from '../models/base/apiCallModel';
import { Biography } from '../models/biographyModel';
import { ApiHelperService } from '../shared/api-helper.service';

@Injectable({
  providedIn: 'root',
})
export class BiographyService {
  constructor(private service: ApiHelperService) {}

  getProfile() {
    let apiCallModel = new ApiCallModel();
    apiCallModel.url = `Biography/GetProfile`;
    apiCallModel.showSuccessAlert = false;
    return this.service.get(apiCallModel);
  }

  saveProfile(model: Biography) {
    let apiCallModel = new ApiCallModel();
    apiCallModel.url = `Biography/SaveProfile`;
    apiCallModel.showSuccessAlert = true;
    apiCallModel.data = model;
    return this.service.post(apiCallModel);
  }
}
