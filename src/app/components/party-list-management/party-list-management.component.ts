import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { InvitationStatus, PublicationListStatus } from 'src/app/enums/enums';
import { environment } from 'src/app/enviroments/environment';
import { ApiDataResponse } from 'src/app/models/base/apiDataRseponseModel';
import { CandidateItem } from 'src/app/models/candidate/CandidateItem';
import { PageDto } from 'src/app/models/PageDto';
import { ElectionZoneDto } from 'src/app/models/partyList/Invitation/ElectionZone';
import { invitation } from 'src/app/models/partyList/Invitation/invitation';
import { CandidateService } from 'src/app/services/candidate.service';
import { PartyManagementService } from 'src/app/services/party-management.service';
import { MessageService } from 'src/app/shared/message.service';
import { Router } from '@angular/router';
import { cancelInvitation } from 'src/app/models/partyList/Invitation/cancelInvitation';
import { MatDialog } from '@angular/material/dialog';
import { CancelInvitationDialogComponent } from '../dialogues/cancel-invitation-dialog/cancel-invitation-dialog.component';
import { deleteInvitation } from 'src/app/models/partyList/Invitation/deleteInvitation';
import { DeleteInvitationDialogComponent } from '../dialogues/delete-invitation-dialogue/delete-invitation-dialogue.component';
import { CommonService } from 'src/app/services/common.service';
import { siteInfo } from 'src/app/models/siteInfo';


interface OptionItem {
  id: string;
  title: string;
  candidateMinCount?: number | null;
  candidateMaxCount?: number | null;
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
  totalCount = 0;
  serverTotalPages = 1;

  dataSource = new MatTableDataSource<invitation>();
  invitationList: invitation[] = [];
  canSendInvitation = false;
  canSendPublicationRequest = false;
  cancelingInvitationId: number | null = null;
  displayedColumns: string[] = [
    'ranking',
    'code',
    'fullName',
    'fatherName',
    'statusTitle',
    'actions',
  ];

  readonly message1 = 'انتخاب حداقل یک نامزد الزامیست';
  //readonly candidateListPublishDeadline = environment.partyList.candidateListPublishDeadline;
  candidateListPublishDeadline = "";
  constructor(
    private candidateService: CandidateService,
    private commonService: CommonService,
    private partyManagementService: PartyManagementService,
    private messageService: MessageService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadProvinces();
    this.commonService.siteInfo.subscribe((resp: siteInfo) => {
      this.candidateListPublishDeadline = resp.value;
    });
  }

  get InvitationStatus() {
    return InvitationStatus;
  }

  get PublicationListStatus() {
    return PublicationListStatus;
  }

  get selectedZoneKeys(): string[] {
    return Object.keys(this.selectedCandidatesByZone);
  }

  get canSearchCandidates(): boolean {
    return !!this.selectedProvinceId && !!this.selectedZoneId;
  }

  get activeZone(): OptionItem | undefined {
    return this.zones.find((x) => x.id === this.selectedZoneId);
  }

  get filterLoading(): boolean {
    return this.provinceLoading || this.zoneLoading;
  }

  get isPublishDeadlinePassed(): boolean {
    return this.hasDeadlinePassed(this.candidateListPublishDeadline);
  }

  get totalCandidateCount(): number {
    return this.totalCount;
  }

  get totalPages(): number {
    return this.serverTotalPages || 1;
  }
goToCandidateInfo(candidateGuid: string): void {
  if (!candidateGuid) {
    this.messageService.showErrorSweetAlert(
      'شناسه نامزد نامعتبر است.',
      'خطا',
    );
    return;
  }

  sessionStorage.setItem('candidateGuid', candidateGuid);

  this.router.navigate(['/CandidateInfo'], {
    state: { candidateGuid: candidateGuid },
  });
}

  

  get paginatedCandidates(): CandidateItem[] {
    return this.candidates;
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
    this.currentPage = 1;
    this.loadCandidates();
  }

  onSearchClick() {
    if (!this.canSearchCandidates) {
      return;
    }

    const term = this.normalizePersianText(this.searchText || '');
    this.currentPage = 1;

    if (!term) {
      this.loadCandidates();
      return;
    }

    this.searchCandidates(term);

  }
  onSearchByEnter(event: KeyboardEvent) {
    if (event.key !== 'Enter') {
      return;
    }

    this.onSearchClick();
  }


  changePage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }

    this.currentPage = page;
    this.loadCandidates();
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.loadCandidates();
  }

  toggleCandidateSelection(item: CandidateItem, checked: boolean, event?: Event) {
    item.isSelected = checked;

    if (checked) {
      const maxCount = this.activeZone?.candidateMaxCount;
      const minCount = this.activeZone?.candidateMinCount;
      if (maxCount !== null && maxCount !== undefined && this.selectedCandidateIds.size >= maxCount) {
        item.isSelected = false;
        const target = event?.target as HTMLInputElement | null;
        if (target) {
          target.checked = false;
        }

        this.messageService.showErrorSweetAlert(`جهت تکمیل لیست حداقل ${minCount} و حداکثر ${maxCount} نامزد میبایست انتخاب شود.`, 'خطا');
        return;
      }

      item.isSelected = true;
      this.selectedCandidateIds.add(item.candidateGuid);
      return;
    }

    item.isSelected = false;

    this.selectedCandidateIds.delete(item.candidateGuid);
  }

  isCandidateSelected(candidateGuid: string): boolean {
    return this.selectedCandidateIds.has(candidateGuid);
  }

  getCandidateFullName(candidate: CandidateItem): string {
    return this.normalizePersianText(
      `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim(),
    );
  }

  addSelectedCandidates() {
    if (!this.selectedZoneId) {
      this.messageService.showErrorSweetAlert(
        'ابتدا حوزه انتخابی را مشخص نمایید.',
        'خطا',
      );
      return;
    }

    const selectedCandidateGuids = Array.from(this.selectedCandidateIds);


    if (selectedCandidateGuids.length === 0) {
      this.messageService.showErrorSweetAlert(this.message1, 'خطا');
      return;
    }

    this.partyManagementService
      .addToPublicationList({
        province: this.selectedProvinceId,
        zoneId: this.selectedZoneId,
        electionType: environment.partyList.electionType,
        candidateList: selectedCandidateGuids,
      })
      .then(() => {
        this.loadInvitations();
      })
      .catch(() => {});
  }

  removeFromSelectedList(zoneId: string, candidateGuid: string) {
    const currentList = this.selectedCandidatesByZone[zoneId] || [];
    this.selectedCandidatesByZone[zoneId] = currentList.filter(
      (x) => x.candidateGuid !== candidateGuid,
    );

    if (this.selectedCandidatesByZone[zoneId].length === 0) {
      delete this.selectedCandidatesByZone[zoneId];
    }
  }

  getZoneTitle(zoneId: string): string {
    return this.normalizePersianText(
      this.zones.find((x) => x.id === zoneId)?.title || zoneId,
    );
  }

  private loadProvinces() {
    this.provinceLoading = true;

    this.commonService
      .getProvincesWithParty(environment.partyList.electionType)
      .then((result: ApiDataResponse<any[]>) => {
        this.provinces = (result?.data || []).map((x) => ({
          id: this.readTextValue(x, ['id', 'provinceId', 'value']),
          title: this.normalizePersianText(
            this.readTextValue(x, ['provinceTitle', 'title', 'name']),
          ),
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

    this.commonService
      .getZonesWithPartyByProvince(Number(provinceId), environment.partyList.electionType)
      .then((result: ApiDataResponse<ElectionZoneDto[]>) => {
        this.zones = (result?.data || []).map((x) => ({
          id: this.readTextValue(x, ['id', 'Id', 'zoneId', 'value']),
          title: this.normalizePersianText(this.readTextValue(x, ['zoneTitle', 'title', 'Title', 'name'])),
          candidateMinCount: this.readNumberValue(x, ['candidateMinCount']),
          candidateMaxCount: this.readNumberValue(x, ['candidateMaxCount']),
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
    if (!this.canSearchCandidates) {
      return;
    }

    this.loading = true;

    this.candidateService
      .getCandidateInquiry({
        electionTypeCode: environment.partyList.electionType,
        provinceId: Number(this.selectedProvinceId),
        electionZoneId: Number(this.selectedZoneId),
        pageCount: this.pageSize,
        pageNo: this.currentPage,
      })
      .then((result: ApiDataResponse<PageDto<CandidateItem>>) => {
        this.loadInvitations();

        const pageData = result?.data;
        const pageItems = pageData?.items || [];

        this.currentPage = pageData?.pageNo || this.currentPage;
        this.pageSize = pageData?.pageCount || this.pageSize;
        this.totalCount = pageData?.totalCount || 0;
        this.serverTotalPages = pageData?.totalPages || 1;

        this.allCandidates = pageItems.map((item) => ({
          ...item,
          firstName: this.normalizePersianText(item.firstName || ''),
          lastName: this.normalizePersianText(item.lastName || ''),
          fatherName: this.normalizePersianText(item.fatherName || ''),
          isSelected: this.selectedCandidateIds.has(item.candidateGuid),
        }));

        this.candidates = [...this.allCandidates];
      })
      .catch(() => {
        this.resetCandidates();
      })
      .finally(() => {
        this.loading = false;
      });
  }


  private searchCandidates(term: string) {
    this.loading = true;

    this.candidateService
      .searchCandidates({
        term,
        electionTypeCode: environment.partyList.electionType,
        provinceId: Number(this.selectedProvinceId),
        electionZoneId: Number(this.selectedZoneId),
        partyId: null,
      })
      .then((result: ApiDataResponse<CandidateItem[]>) => {
        const items = result?.data || [];

        this.allCandidates = items.map((item) => ({
          ...item,
          firstName: this.normalizePersianText(item.firstName || ''),
          lastName: this.normalizePersianText(item.lastName || ''),
          fatherName: this.normalizePersianText(item.fatherName || ''),
          isSelected: this.selectedCandidateIds.has(item.candidateGuid),
        }));

        this.candidates = [...this.allCandidates];
        this.totalCount = this.candidates.length;
        this.serverTotalPages = 1;
        this.currentPage = 1;
      })
      .catch(() => {
        this.resetCandidates();
      })
      .finally(() => {
        this.loading = false;
      });
  }


  private resetCandidates() {
    this.allCandidates = [];
    this.candidates = [];
    this.totalCount = 0;
    this.serverTotalPages = 1;
    this.currentPage = 1;
  }
  private resetInvitaions() {
    this.dataSource.data = [];
    this.canSendInvitation = false;
    this.canSendPublicationRequest = false;

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

  private readNumberValue(item: any, keys: string[]): number | null {
    for (const key of keys) {
      const value = item?.[key];
      if (value !== undefined && value !== null && value !== '') {
        const parsedValue = Number(value);
        return Number.isNaN(parsedValue) ? null : parsedValue;
      }
    }

    return null;
  }

  private hasDeadlinePassed(deadlineText: string): boolean {
    const value = this.normalizeDigits(String(deadlineText || '').trim());
    if (!value) {
      return false;
    }

    const yearPart = Number(value.split(/[\/-]/)[0]);
    const isJalaliLike = /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(value) && yearPart >= 1300 && yearPart < 1700;
    if (isJalaliLike) {
      const todayJalali = new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(new Date()).replace(/-/g, '/');

      return value.replace(/-/g, '/') < todayJalali;
    }

    const dateValue = new Date(value);
    if (Number.isNaN(dateValue.getTime())) {
      return false;
    }

    dateValue.setHours(23, 59, 59, 999);
    return new Date() > dateValue;
  }

  private normalizeDigits(value: string): string {
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
    const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
    return value
      .split('')
      .map((char) => {
        const persianIndex = persianDigits.indexOf(char);
        if (persianIndex > -1) {
          return String(persianIndex);
        }

        const arabicIndex = arabicDigits.indexOf(char);
        if (arabicIndex > -1) {
          return String(arabicIndex);
        }

        return char;
      })
      .join('');
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
      
      const normalizedData = (result?.data || []).map(item => ({
        ...item,
        firstName: this.normalizePersianText(item.firstName),
        lastName: this.normalizePersianText(item.lastName)
      }));

      this.dataSource.data = normalizedData;
      let readyToSendInvitations = this.dataSource.data.filter(x => x.status == InvitationStatus.ReadyToSend);
      let sentInvitations =  this.dataSource.data.filter(x => x.status == InvitationStatus.Sent);
      let confirmedInvitations =  this.dataSource.data.filter(x => x.status == InvitationStatus.Confirmed);
      let currentInvitationsCount = this.dataSource.data.length;
      
      let listStatus = this.dataSource.data.length == 0 ? null:this.dataSource.data[0].listStatus;
      this.canSendInvitation = readyToSendInvitations.length > 0  
                          && currentInvitationsCount >= this.activeZone?.candidateMinCount
                          && currentInvitationsCount <= this.activeZone?.candidateMaxCount
                          && !this.isPublishDeadlinePassed;

      this.canSendPublicationRequest = listStatus == PublicationListStatus.Created 
                          && readyToSendInvitations.length == 0
                          && sentInvitations.length == 0
                          && confirmedInvitations.length  >= this.activeZone?.candidateMinCount
                          && confirmedInvitations.length  <= this.activeZone?.candidateMaxCount
                          && !this.isPublishDeadlinePassed;
                          
      // let rejectedInvitations = this.dataSource.data.filter(x => x.status == InvitationStatus.Rejected);
      // this.dataSource.data = this.dataSource.data.filter(x => x.status != InvitationStatus.Rejected)
      //                         .concat(rejectedInvitations);
    })
    .catch(() => {
      this.resetInvitaions();
    })
    .finally(() => {
    });
}
  sendInvitations(){

    if (this.isPublishDeadlinePassed) {
      this.messageService.showErrorSweetAlert('مهلت ارسال لیست به پایان رسیده است.', 'خطا');
      return;
    }

    if (!this.selectedProvinceId || !this.selectedZoneId) {
      this.messageService.showErrorSweetAlert(
        'ابتدا حوزه انتخابی را مشخص نمایید.',
        'خطا',
      );
      return;
    }

    if (
      !this.dataSource.data ||
      !this.dataSource.data.length ||
      !this.dataSource.data.some((x) => x.status == InvitationStatus.ReadyToSend)
    ) {
      this.messageService.showErrorSweetAlert(
        'امکان ارسال دعوت‌نامه وجود ندارد',
        'خطا',
      );
      return;
    }

    const publicationListId = this.dataSource.data[0].publicationListId;

    this.partyManagementService
      .sendInvitationList({
        publicationListId: publicationListId,
      })
      .then(() => {
        this.loadInvitations();
      })
      .catch(() => {});
  }
sendPublicationRequest() {
    if (!this.selectedProvinceId || !this.selectedZoneId) {
      this.messageService.showErrorSweetAlert('ابتدا حوزه انتخابی را مشخص نمایید.', 'خطا');
      return;
    }
    if (!this.dataSource.data || !this.dataSource.data[0]) {
      this.messageService.showErrorSweetAlert('لیست نهایی برای ارسال درخواست انتشار موجود نیست.', 'خطا');
      return;
    }

    const minCount = this.activeZone?.candidateMinCount ?? 0;
    const maxCount = this.activeZone?.candidateMaxCount ?? Number.MAX_SAFE_INTEGER;
    const candidateCount = this.dataSource.data.length;
    if (candidateCount < minCount || candidateCount > maxCount) {
      this.messageService.showErrorSweetAlert(`برای ارسال درخواست انتشار لیست، تعداد نامزد ها باید حداقل ${minCount} و حداکثر ${maxCount} باشد.`, 'خطا');
      return;
    }

    const confirmText = `به‌منظور انتشار لیست نامزدهای مورد تأیید، انتخاب حداقل ${minCount} و حداکثر ${maxCount} نامزد و در قالب یک درخواست واحد امکان‌پذیر است.<br><br>
    امکان ثبت و تکمیل لیست در چند مرحله وجود ندارد.<br><br>
    آیا از ثبت درخواست خود اطمینان دارید؟<br>`;

    this.messageService
      .showConrifmSweetAlert(confirmText, 'تایید ارسال درخواست انتشار', 'تایید', 'انصراف')
      .then(() => {
        const publicationListId = this.dataSource.data[0].publicationListId;
        return this.partyManagementService.sendPublicationRequest({ publicationListId });
      })
      .then(() => {
        this.messageService.showSuccessSweetAlert('درخواست انتشار لیست با موفقیت ارسال شد.', 'موفق');
        this.loadInvitations();
      })
      .catch(() => {
      });
  }

  drop(event: any) {
    if (event.previousIndex == event.currentIndex) {
      return;
    }

    this.partyManagementService
      .changeRankBeforeSend({
        invitationId: event.item.data.invitationId,
        ranking: event.currentIndex + 1,
      })
      .then(() => {
        this.loadInvitations();
      })
      .catch(() => {});
  }

  deleteInvitation(item: invitation) {
    const dialogRef = this.dialog.open(DeleteInvitationDialogComponent, {
      width: '420px',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: item.status
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      const request: deleteInvitation = {
        invitationId: item.invitationId,
        description: result.description
      };

      this.partyManagementService.deleteInvitation(request)
        .then((res: any) => {
          if (res?.isSuccess === false) {
            this.messageService.showErrorSweetAlert(
              res?.resultMessage || 'حذف دعوت با خطا مواجه شد.',
              'خطا'
            );
            return;
          }

          this.messageService.showSuccessSweetAlert(
            'دعوت‌نامه با موفقیت حذف شد.',
            'موفق'
          );
          this.loadInvitations();
        })
        .catch(() => {
          this.messageService.showErrorSweetAlert(
            'حذف دعوت با خطا مواجه شد.',
            'خطا'
          );
        });
    });
  }

  
openCancelInvitationDialog(item: invitation) {
  const dialogRef = this.dialog.open(CancelInvitationDialogComponent, {
      width: '420px',
      disableClose: true,
      panelClass: 'custom-dialog-container',
    data: {
      invitationId: item.invitationId,
      description: item.description || ''
    }
  });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      const request: cancelInvitation = {
        invitationId: item.invitationId,
        description: result.description
      };

      this.partyManagementService
        .cancelInvitation(request)
        .then((res: any) => {
          if (res?.isSuccess === false) {
            this.messageService.showErrorSweetAlert(
              res?.resultMessage || 'لغو دعوت با خطا مواجه شد.',
              'خطا'
            );
            return;
          }

          this.messageService.showSuccessSweetAlert(
            'دعوت‌نامه با موفقیت لغو شد.',
            'موفق'
          );
          this.loadInvitations();
        })
        .catch(() => {
          this.messageService.showErrorSweetAlert(
            'لغو دعوت با خطا مواجه شد.',
            'خطا'
          );
        });
    });
  }
}