import { Injectable } from '@angular/core';
import { WebPortalsModel } from '../models/WebPortalsModel';
import { ApiCallModel } from '../models/base/apiCallModel';
import { ApiHelperService } from '../shared/api-helper.service';

@Injectable({
  providedIn: 'root',
})
export class WebPortalService {
  constructor(private service: ApiHelperService) {}

  getURLs() {
    let apiCallModel = new ApiCallModel();
    apiCallModel.url = 'WebPortal/GetSocialAds';
    apiCallModel.showSuccessAlert = false;
    return this.service.get(apiCallModel);
  }
 

  deleteURL(model: WebPortalsModel) {
    var apiModel = new ApiCallModel();
    apiModel.url =  'WebPortal/DeleteSocialAds' ;
    apiModel.data = model.id;
    apiModel.showSuccessAlert = true;
    apiModel.showConfirmAlert = true;
    apiModel.confirmAlertText = ' <strong>هشدار!</strong> آیا از حذف این رکورد اطمینان دارید؟ این عملیات قابل بازگشت نمی‌باشد.'
    return this.service.post(apiModel);
  } 

  insertURL(model: WebPortalsModel) {
    let apiCallModel = new ApiCallModel();
    apiCallModel.url = 'WebPortal/SaveSocialAds'
    apiCallModel.showSuccessAlert = true;
    apiCallModel.data = model;
    return this.service.post(apiCallModel);
  }
  
}
