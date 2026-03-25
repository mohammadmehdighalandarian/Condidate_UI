import { Injectable } from '@angular/core';
import { ApiCallModel } from '../models/base/apiCallModel';
import { ApiHelperService } from '../shared/api-helper.service';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  constructor(private api: ApiHelperService) {}

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

  getCandidateInquiry(filter: {
    electionTypeCode: number;
    provinceId: number;
    electionZoneId: number;
  }) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Candidate/CandidateInquiry';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = filter;
    return this.api.post(apiCallModel);
  }

  submitSelectedCandidates(model: {
    province: string;
    zone: string;
    electionType: number,
    candidateList: string[];
  }) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Candidate/SaveSelectedCandidates';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = model;
    return this.api.post(apiCallModel);
  }
  getCandidateBasicInformation(candidateId: string) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Common/GetCandidateBasicInformation';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = {
      candidateId: candidateId,
    };
    return this.api.get(apiCallModel);
  }

  getCandidateBiography(candidateId: string) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Candidate/GetCandidateBiography';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = {
      candidateId: candidateId,
    };
    return this.api.get(apiCallModel);
  }

  getCandidateWebsites(candidateId: string) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Candidate/GetCandidateWebsites';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = {
      candidateId: candidateId,
    };
    return this.api.get(apiCallModel);
  }

  getCandidateSocialMedia(candidateId: string) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Candidate/GetCandidateSocialMedia';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = {
      candidateId: candidateId,
    };
    return this.api.get(apiCallModel);
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
}