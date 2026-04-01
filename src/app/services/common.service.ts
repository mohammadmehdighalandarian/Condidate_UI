import { Injectable } from '@angular/core';
import { ApiCallModel } from '../models/base/apiCallModel';
import { ApiHelperService } from '../shared/api-helper.service';
import { BehaviorSubject } from 'rxjs';
import { siteInfo } from '../models/siteInfo';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  constructor(private api: ApiHelperService) { }
  public siteInfo = new BehaviorSubject(new siteInfo());
  getProvinces(electionType: number) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Common/GetProvinces';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = { electionType };
    return this.api.post(apiCallModel);
  }

  getZonesByProvince(provinceId: number, electionType: number) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Common/GetElectionZones';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = { provinceId, electionType };
    return this.api.post(apiCallModel);
  }
  
  getProvincesWithParty(electionType: number) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Common/GetProvinceWithParty';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.showLoading = false;
    apiCallModel.data = { electionType };
    return this.api.post(apiCallModel);
  }
  getZonesWithPartyByProvince(provinceId: number, electionType: number) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Common/GetZonesWithParty';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.showLoading = false;
    apiCallModel.data = { provinceId, electionType };
    return this.api.post(apiCallModel);
  }
  
  getSiteInfo() {
    let apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Common/GetSiteInfo';
    apiCallModel.showErrorAlert = true;
    apiCallModel.showNoDataAlert = true;
    apiCallModel.resolveAfterMessage = true;
    return this.api.get(apiCallModel);
  }
}
