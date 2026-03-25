import { Injectable } from '@angular/core';
import { ApiCallModel } from '../models/base/apiCallModel';
import { ApiHelperService } from '../shared/api-helper.service';

@Injectable({
  providedIn: 'root',
})
export class AcceptLawsService {
  constructor(private service: ApiHelperService) {}

  checkLawAcceptance() {
    let apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Home/CheckAcceptLaws'; 
    apiCallModel.showSuccessAlert = false;
    return this.service.get(apiCallModel);
  }

  setAcceptance() { 
    let apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Home/SetAcceptLaws'; 
    apiCallModel.showSuccessAlert = false;
    return this.service.post(apiCallModel);
  }

  getContractText() {
    let apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Home/GetContractText'; 
    apiCallModel.showSuccessAlert = false; 
    return this.service.get(apiCallModel);
  }
}
