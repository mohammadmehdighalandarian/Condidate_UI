import { Injectable } from '@angular/core';
import { ApiCallModel } from '../models/base/apiCallModel';
import { ApiHelperService } from '../shared/api-helper.service';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  constructor(private api: ApiHelperService) {}

  getCandidateInquiry(filter: {
    electionTypeCode: number;
    provinceId: number;
    electionZoneId: number;
    pageCount: number;
    pageNo: number;
  }) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Candidate/CandidateInquiry';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.showLoading = false;
    apiCallModel.data = filter;
    return this.api.post(apiCallModel);
  }

  submitSelectedCandidates(model: {
    province: string;
    zone: string;
    electionType: number;
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
    apiCallModel.url = 'Candidate/GetCandidateBasicInformation';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = {candidateId };
    return this.api.post(apiCallModel);
  }

  getCandidateBiography(candidateId: string) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Biography/GetCandidateBiography';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = {
      candidateId
    };
    return this.api.post(apiCallModel);
  }

  getCandidateWebsites(candidateId: string) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'WebPortal/GetCandidateWebsites';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = {
      candidateId
    };
    return this.api.post(apiCallModel);
  }

  getCandidateSocialMedia(candidateId: string) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'SocialNetwork/GetCandidateSocialMedia';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = {
      candidateId
    };
    return this.api.post(apiCallModel);
  }
  searchCandidates(filter: {
    term: string;
    electionTypeCode: number | null;
    provinceId: number | null;
    electionZoneId: number | null;
    partyId: number | null;
  }) {
    const apiCallModel = new ApiCallModel();
    apiCallModel.url = 'Candidate/SearchCandidates';
    apiCallModel.showSuccessAlert = false;
    apiCallModel.data = filter;
    return this.api.post(apiCallModel);
  }
}