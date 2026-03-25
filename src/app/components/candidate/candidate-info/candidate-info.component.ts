import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CandidateDetailModel } from 'src/app/models/candidate/CandidateDetailModel';
import { CandidateService } from 'src/app/services/candidate.service';

@Component({
  selector: 'app-candidate-info',
  templateUrl: './candidate-info.component.html',
  styleUrls: ['./candidate-info.component.css']
})
export class CandidateInfoComponent implements OnInit {
  activeTab: 'profile' | 'biography' | 'social' | 'websites' = 'profile';

  candidateId = '';
  candidateInfo: CandidateDetailModel = {
    fullName: '',
    provinceTitle: '',
    zoneTitle: '',
    universityTitle: '',
    educationLevelTitle: '',
    fieldTendencyTitle: '',
    jobOrganizationTitle: '',
    jobTitle: '',
    biography: '',
    socialMedias: [],
    webSites: [],
    imageUrl: ''
  } as CandidateDetailModel;

  loading = false;
  errorText = '';

  constructor(
    private router: Router,
    private candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    const id = history.state?.candidateId;
console.log("iiiiiidddddd",id)
    if (!id) {
      this.errorText = 'شناسه نامزد نامعتبر است';
      return;
    }

    this.candidateId = id;
    this.loadBasicInfo();
  }

  get hasBiography(): boolean {
    return !!this.candidateInfo?.biography?.trim();
  }

  async setTab(tab: 'profile' | 'biography' | 'social' | 'websites'): Promise<void> {
    this.activeTab = tab;

    if (tab === 'biography' && !this.candidateInfo.biography) {
      await this.loadBiography();
    }

    if (tab === 'social' && this.candidateInfo.socialMedias.length === 0) {
      await this.loadSocialMedia();
    }

    if (tab === 'websites' && this.candidateInfo.webSites.length === 0) {
      await this.loadWebsites();
    }
  }

  goBack(): void {
    this.router.navigate(['/party-secretary/request-list']);
  }

  private async loadBasicInfo(): Promise<void> {
    debugger
    this.loading = true;
    this.errorText = '';

    try {
      const res: any = await this.candidateService.getCandidateBasicInformation(this.candidateId);

      this.candidateInfo = {
        ...this.candidateInfo,
        ...res.data
      };
    } catch {
      this.errorText = 'خطا در دریافت اطلاعات نامزد';
    } finally {
      this.loading = false;
    }
  }

  private async loadBiography(): Promise<void> {
    this.loading = true;

    try {
      const res: any = await this.candidateService.getCandidateBiography(this.candidateId);
      this.candidateInfo.biography = res?.data?.biography || '';
    } catch {
      this.errorText = 'خطا در دریافت زندگینامه نامزد';
    } finally {
      this.loading = false;
    }
  }

  private async loadSocialMedia(): Promise<void> {
    this.loading = true;

    try {
      const res: any = await this.candidateService.getCandidateSocialMedia(this.candidateId);
      this.candidateInfo.socialMedias = res?.data || [];
    } catch {
      this.errorText = 'خطا در دریافت شبکه های اجتماعی';
    } finally {
      this.loading = false;
    }
  }

  private async loadWebsites(): Promise<void> {
    this.loading = true;

    try {
      const res: any = await this.candidateService.getCandidateWebsites(this.candidateId);
      this.candidateInfo.webSites = res?.data || [];
    } catch {
      this.errorText = 'خطا در دریافت آدرس های اینترنتی';
    } finally {
      this.loading = false;
    }
  }
}