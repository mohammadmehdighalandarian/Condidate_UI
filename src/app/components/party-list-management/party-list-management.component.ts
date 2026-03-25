import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InvitationStatus } from 'src/app/enums/enums';
import { environment } from 'src/app/enviroments/environment';
import { ApiDataResponse } from 'src/app/models/base/apiDataRseponseModel';
import { invitation } from 'src/app/models/partyList/Invitation/invitation';
import { CandidateService } from 'src/app/services/candidate.service';
import { PartyManagementService } from 'src/app/services/party-management.service';
import { MessageService } from 'src/app/shared/message.service';

interface CandidateItem {
  candidateGuid: string;
  code: number;
  firstName: string;
  lastName: string;
  fatherName: string;
  cellPhoneNumber: string;
  isSelected: boolean;
}

interface OptionItem {
  id: string;
  title: string;
}

@Component({
  selector: 'app-party-list-management',
  templateUrl: './party-list-management.component.html',
  styleUrls: ['./party-list-management.component.css'],
})
export class PartyListManagementComponent implements OnInit {
  activeTab: 'select-candidates' | 'selected-list' = 'select-candidates';

  provinces: OptionItem[] = [];
  zones: OptionItem[] = [];

  selectedProvinceId = '';
  selectedZoneId = '';
  searchText = '';

  allCandidates: CandidateItem[] = [];
  candidates: CandidateItem[] = [];
  loading = false;
  provinceLoading = false;
  zoneLoading = false;

  selectedCandidateIds = new Set<string>();
  selectedCandidatesByZone: { [zoneId: string]: CandidateItem[] } = {};

  pageSizeOptions = [10, 20, 50];
  pageSize = 10;
  currentPage = 1;

  dataSource = new MatTableDataSource<invitation>();
  invitationList: invitation[] = [];
  canSendInvitation = false;
  displayedColumns: string[] = ['ranking','code','fullName','fatherName','statusTitle','actions'];

  readonly message1 = 'انتخاب حداقل یک نامزد الزامیست';

  constructor(
    private candidateService: CandidateService,
    private  partyManagementService: PartyManagementService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProvinces();
  }

  get selectedZoneKeys(): string[] {
    return Object.keys(this.selectedCandidatesByZone);
  }

  get canSearchCandidates(): boolean {
    return !!this.selectedProvinceId && !!this.selectedZoneId;
  }

  get filterLoading(): boolean {
    return this.provinceLoading || this.zoneLoading;
  }

  get totalCandidateCount(): number {
    return this.candidates.length;
  }

  get totalPages(): number {
    if (!this.totalCandidateCount) {
      return 1;
    }

    return Math.ceil(this.totalCandidateCount / this.pageSize);
  }

  get paginatedCandidates(): CandidateItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.candidates.slice(start, start + this.pageSize);
  }

  selectTab(tab: 'select-candidates' | 'selected-list') {
    this.activeTab = tab;
  }

  onProvinceChange() {
    this.selectedZoneId = '';
    this.selectedCandidateIds.clear();
    this.searchText = '';
    this.resetCandidates();
    this.resetInvitaions();
    if (!this.selectedProvinceId) {
      this.zones = [];
      return;
    }

    this.loadZones(this.selectedProvinceId);
  }

  onZoneChange() {
    this.selectedCandidateIds.clear();
    this.searchText = '';
    this.resetCandidates();
    this.resetInvitaions();

    if (!this.selectedProvinceId || !this.selectedZoneId) {
      return;
    }

    this.loadCandidates();
  }

  onSearchChange() {
    if (!this.canSearchCandidates) {
      return;
    }

    this.applyClientSearch();
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
  }

  onPageSizeChange() {
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
  }

  toggleCandidateSelection(item: CandidateItem, checked: boolean) {
    item.isSelected = checked;
    if (checked) {
      this.selectedCandidateIds.add(item.candidateGuid);
      return;
    }

    this.selectedCandidateIds.delete(item.candidateGuid);
  }

  isCandidateSelected(candidateGuid: string): boolean {
    console.log("Test");
    return this.selectedCandidateIds.has(candidateGuid);
  }

  getCandidateFullName(candidate: CandidateItem): string {
    return this.normalizePersianText(`${candidate.firstName || ''} ${candidate.lastName || ''}`.trim());
  }


  addSelectedCandidates() {
    if (!this.selectedZoneId) {
      this.messageService.showErrorSweetAlert('ابتدا حوزه انتخابی را مشخص نمایید.', 'خطا');
      return;
    }

    const selectedCandidates = this.candidates.filter((x) =>
      this.selectedCandidateIds.has(x.candidateGuid)
    );

    if (selectedCandidates.length === 0) {
      this.messageService.showErrorSweetAlert(this.message1, 'خطا');
      return;
    }
    this.partyManagementService.addToPublicationList({
        province: this.selectedProvinceId,
        zoneId: this.selectedZoneId,
        electionType: environment.partyList.electionType,
        candidateList: selectedCandidates.map((x) => x.candidateGuid),
      })
      .then(() => {
        this.loadInvitations();
        // const existingList = this.selectedCandidatesByZone[this.selectedZoneId] || [];
        // const existingIds = new Set(existingList.map((x) => x.candidateGuid));
        // const newItems = selectedCandidates.filter((x) => !existingIds.has(x.candidateGuid));

        // this.selectedCandidatesByZone[this.selectedZoneId] = [...existingList, ...newItems];
        // this.selectedCandidateIds.clear();

        // this.messageService.showSuccessSweetAlert(
        //   'نامزدهای انتخاب‌شده با موفقیت ثبت شدند.',
        //   'موفق'
        //);
      })
      .catch((error: any) => {
        // const backendMessage =
        //   error?.error?.responseDesc ||
        //   error?.responseDesc ||
        //   error?.message ||
        //   'ثبت لیست نامزدها با خطا مواجه شد.';

        // this.messageService.showErrorSweetAlert(backendMessage, 'خطا');
      });
  }

  removeFromSelectedList(zoneId: string, candidateGuid: string) {
    const currentList = this.selectedCandidatesByZone[zoneId] || [];
    this.selectedCandidatesByZone[zoneId] = currentList.filter(
      (x) => x.candidateGuid !== candidateGuid
    );

    if (this.selectedCandidatesByZone[zoneId].length === 0) {
      delete this.selectedCandidatesByZone[zoneId];
    }
  }



  getZoneTitle(zoneId: string): string {
    return this.normalizePersianText(this.zones.find((x) => x.id === zoneId)?.title || zoneId);
  }

  private loadProvinces() {
    this.provinceLoading = true;

    this.candidateService
      .getProvincesWithParty(environment.partyList.electionType)
      .then((result: ApiDataResponse<any[]>) => {
        this.provinces = (result?.data || []).map((x) => ({
          id: this.readTextValue(x, ['id', 'provinceId', 'value']),
          title: this.normalizePersianText(this.readTextValue(x, ['provinceTitle', 'title', 'name'])),
        }));
      })
      .catch(() => {
        this.provinces = [];
      })
      .finally(() => {
        this.provinceLoading = false;
      });
  }

  private loadZones(provinceId: string) {
    this.zoneLoading = true;

    this.candidateService
      .getZonesWithPartyByProvince(Number(provinceId), environment.partyList.electionType)
      .then((result: ApiDataResponse<any[]>) => {
        this.zones = (result?.data || []).map((x) => ({
          id: this.readTextValue(x, ['id', 'zoneId', 'value']),
          title: this.normalizePersianText(this.readTextValue(x, ['zoneTitle', 'title', 'name'])),
        }));
      })
      .catch(() => {
        this.zones = [];
      })
      .finally(() => {
        this.zoneLoading = false;
      });
  }

  private loadCandidates() {
    this.candidateService
      .getCandidateInquiry({
        electionTypeCode: environment.partyList.electionType,
        provinceId: Number(this.selectedProvinceId),
        electionZoneId: Number(this.selectedZoneId),
      })
      .then((result: ApiDataResponse<CandidateItem[]>) => {
        this.loadInvitations();
        this.allCandidates = (result?.data || []).map((item) => ({
          ...item,
          firstName: this.normalizePersianText(item.firstName || ''),
          lastName: this.normalizePersianText(item.lastName || ''),
          fatherName: this.normalizePersianText(item.fatherName || ''),
          isSelected: this.selectedCandidateIds.has(item.candidateGuid)
        }));
        this.applyClientSearch();
      })
      .catch(() => {
        this.resetCandidates();
      });
  }

  private applyClientSearch() {
    const text = this.normalizePersianText(this.searchText || '').toLowerCase();

    if (!text) {
      this.candidates = [...this.allCandidates];
    } else {
      this.candidates = this.allCandidates.filter((x) => {
        const codeText = String(x.code || '').toLowerCase();
        const firstName = this.normalizePersianText(x.firstName || '').toLowerCase();
        const lastName = this.normalizePersianText(x.lastName || '').toLowerCase();
        return (
          codeText.includes(text) ||
          firstName.includes(text) ||
          lastName.includes(text)
        );
      });
    }

    this.currentPage = Math.min(this.currentPage, this.totalPages);
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
  }

  private resetCandidates() {
    this.allCandidates = [];
    this.candidates = [];
  }
  private resetInvitaions() {
    this.dataSource.data = [];
  }

  private readTextValue(item: any, keys: string[]): string {
    if (typeof item === 'string') {
      return item;
    }

    for (const key of keys) {
      if (item && item[key] !== undefined && item[key] !== null) {
        return String(item[key]);
      }
    }

    return '';
  }

  normalizePersianText(value: string): string {
    return String(value || '')
      .replace(/[يى]/g, 'ی')
      .replace(/ك/g, 'ک')
      .replace(/\s+/g, ' ')
      .trim();
  }
  private loadInvitations() {
    this.partyManagementService.getInvitationList({
        electionTypeCode: environment.partyList.electionType,
        electionZoneId: Number(this.selectedZoneId)
      })
      .then((result: ApiDataResponse<invitation[]>) => {
        this.dataSource.data = result?.data ;
        this.canSendInvitation = this.dataSource.data &&
                                  this.dataSource.data.some(x=> x.status == InvitationStatus.ReadyToSend);
      })
      .catch(() => {
        this.resetInvitaions();
      })
      .finally(() => {
      });
  }
  sendInvitations(){
    if (!this.selectedProvinceId || !this.selectedZoneId) {
      this.messageService.showErrorSweetAlert('ابتدا حوزه انتخابی را مشخص نمایید.', 'خطا');
    }
    if(!this.dataSource.data || !this.dataSource.data[0] || 
      !this.dataSource.data.some(x=> x.status == InvitationStatus.ReadyToSend)){
      this.messageService.showErrorSweetAlert('امکان ارسال دعوت‌نامه وجود ندارد', 'خطا');
    }
    let publicationListId = this.dataSource.data[0].publicationListId
    this.partyManagementService.sendInvitationList({
        publicationListId: publicationListId
      })
      .then(() => {
        this.loadInvitations()
      })
      .catch((error: any) => {
      })
      .finally(() => {
      });

  }
  drop(event) {
    if(event.previousIndex == event.currentIndex){
      return;
    }
    this.partyManagementService.changeRankBeforeSend({
        invitationId: event.item.data.invitationId,
        ranking: event.currentIndex + 1
      })
      .then(() => {
        this.loadInvitations()
      })
      .catch((error: any) => {
      })
      .finally(() => {
      });
    // const previousIndex = this.dataSource.data.findIndex((d) => d === event.item.data);
    // moveItemInArray(this.dataSource.data, previousIndex, event.currentIndex);
    // this.dataSource = new MatTableDataSource(this.dataSource.data);

  }
}
