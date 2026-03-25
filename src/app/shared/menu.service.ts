import { Injectable } from '@angular/core';

import { ApiCallModel } from '../models/base/apiCallModel';
import { ApiHelperService } from '../shared/api-helper.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor(private service: ApiHelperService) { }

  getMenuList() {
    let apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Account/GetMenuList';
    apiCallModel.showErrorAlert = true;
    apiCallModel.showNoDataAlert = true;
    apiCallModel.resolveAfterMessage = true;
    return this.service.get(apiCallModel);

  }
}
