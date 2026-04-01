import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ElectionZoneDto } from 'src/app/models/partyList/Invitation/ElectionZone';
import { CandidateInvitationViewModel } from 'src/app/models/invitation/candidateInvitationViewModel';
import { environment } from 'src/app/enviroments/environment.prod';
import { ApiDataResponse } from 'src/app/models/base/apiDataRseponseModel';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FileExcelService } from 'src/app/shared/FileExcelService';
import { MessageService } from 'src/app/shared/message.service';
import { CommonService } from 'src/app/services/common.service';
import { InvitationListService } from 'src/app/services/invitation-list.service';
import { InvitationStatusHistoryViewModel } from 'src/app/models/invitation/invitationStatusHistoryViewModel';
import { MatDialog } from '@angular/material/dialog';
import { StatusHistoryDialogComponent } from '../dialogues/status-history-dialog/status-history-dialog.component';
import { PublicationDescriptionDialogComponent } from '../dialogues/publication-request-dialog/publication-description-dialog.component';

@Component({
  selector: 'app-invitation-list',
  templateUrl: './invitation-list.component.html',
  styleUrls: ['./invitation-list.component.css'],
})
export class InvitationListComponent implements OnInit {
  selectedProvinceId: string = '';
  selectedZoneId: string = '';
  searchText: string = '';

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  invitations: CandidateInvitationViewModel[] = [];
  totalInvitations: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  provinceLoading = false;
  zoneLoading = false;

  dataSource = new MatTableDataSource<CandidateInvitationViewModel>(
    this.invitations,
  );
  maxCellLength = 30;

  displayedColumns: string[] = [
    'invitationDate',
    'candidateCode',
    'fullName',
    'fatherName',
    'provinceTitle',
    'electionZoneTitle',
    'invitationStatus',
    'invitationDescription',
    'actions',
  ];

  provinces: { id: string; title: string }[];
  zones: any;
  historyLoading: boolean;

  constructor(
    private service: InvitationListService,
    private commonService: CommonService,
    private messageService: MessageService,
    private fileExcelService: FileExcelService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadProvinces();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  downloadExcelFile(): void {
    const excelData = this.createExcelData(this.dataSource.filteredData);

    if (!excelData || excelData.length === 0) {
      this.messageService.showErrorSweetAlert(
        'داده‌ای برای خروجی اکسل یافت نشد.',
        'خطا',
      );
      return;
    }

    this.fileExcelService.SaveToExcel(excelData, 'لیست دعوت‌نامه‌ها');
  }

  createExcelData(data: any[]): any[] {
    return (data || []).map((item) => ({
      'تاریخ ارسال دعوت‌نامه': item.invitationDate || '',
      'کد نامزد': item.candidateCode || '',
      'نام نامزد':
        item.fullName ||
        this.normalizePersianText(
          `${item.firstName || ''} ${item.lastName || ''}`,
        ),
      'نام پدر': item.fatherName || '',
      استان: item.provinceTitle || '',
      'حوزه انتخابی': item.electionZoneTitle || '',
      وضعیت: item.invitationStatus || '',
      توضیحات: item.invitationDescription || '',
    }));
  }

  private loadZones(provinceId: string) {
    this.zoneLoading = true;

    this.commonService
      .getZonesWithPartyByProvince(
        Number(provinceId),
        environment.partyList.electionType,
      )
      .then((result: ApiDataResponse<ElectionZoneDto[]>) => {
        this.zones = (result?.data || []).map((x) => ({
          id: this.readTextValue(x, ['id', 'Id', 'zoneId', 'value']),
          title: this.normalizePersianText(
            this.readTextValue(x, ['zoneTitle', 'title', 'Title', 'name']),
          ),
        }));
      })
      .catch(() => {
        this.zones = [];
      })
      .finally(() => {
        this.zoneLoading = false;
      });
  }

  getZoneTitle(zoneId: string): string {
    return this.zones.find((x) => x.id === zoneId)?.title || zoneId;
  }

  normalizePersianText(value: string): string {
    return String(value || '')
      .replace(/[يى]/g, 'ی')
      .replace(/ك/g, 'ک')
      .replace(/\s+/g, ' ')
      .trim();
  }

  onProvinceChange() {
    this.selectedZoneId = '';
    this.zones = [];
    this.invitations = [];
    this.dataSource.data = [];
    this.totalInvitations = 0;

    if (this.selectedProvinceId) {
      this.loadZones(this.selectedProvinceId);
    }
  }

  onZoneChange() {
    this.invitations = [];
    this.dataSource.data = [];
    this.totalInvitations = 0;
  }

  onSearchClick() {
    if (!this.selectedProvinceId || !this.selectedZoneId) {
      return;
    }

    this.currentPage = 1;
    this.loadInvitations();
  }

  loadInvitations() {
    if (!this.selectedProvinceId || !this.selectedZoneId) {
      return;
    }

    this.service
      .getInvitations(
        Number(this.selectedProvinceId),
        Number(this.selectedZoneId),
      )
      .then((response: any) => {
        const items = response?.data || [];

        const mappedItems = items.map((item: any) => ({
          invitationId: item.invitationId,
          invitationDate: item.invitationDate,
          candidateId: item.candidateId,
          candidateCode: item.candidateCode,
          firstName: item.firstName,
          lastName: item.lastName,
          fullName: this.normalizePersianText(
            `${item.firstName || ''} ${item.lastName || ''}`,
          ),
          fatherName: item.fatherName,
          provinceTitle: item.provinceTitle,
          electionZoneTitle: item.electionZoneTitle,
          invitationStatus: item.invitationStatus,
          invitationDescription: item.invitationDescription,
        }));

        const normalizedSearch = this.normalizePersianText(
          this.searchText,
        ).toLowerCase();

        const filteredItems = !normalizedSearch
          ? mappedItems
          : mappedItems.filter((item: any) => {
              const rowText = this.normalizePersianText(
                [
                  item.invitationDate,
                  item.candidateCode,
                  item.fullName,
                  item.fatherName,
                  item.provinceTitle,
                  item.electionZoneTitle,
                  item.invitationStatus,
                  item.invitationDescription,
                ]
                  .filter(Boolean)
                  .join(' '),
              ).toLowerCase();

              return rowText.includes(normalizedSearch);
            });

        this.invitations = filteredItems;
        this.dataSource.data = filteredItems;
        this.totalInvitations = filteredItems.length;
      })
      .catch((error) => {
        console.error('Error loading invitations', error);
        this.invitations = [];
        this.dataSource.data = [];
        this.totalInvitations = 0;
      });
  }
  applyFilter(event) {
    let filterValue = event.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  openStatusHistoryDialog(item: any): void {
    if (!item?.invitationId) {
      this.messageService.showErrorSweetAlert(
        'شناسه دعوت‌نامه معتبر نیست.',
        'خطا',
      );
      return;
    }

    this.historyLoading = true;

    this.service
      .getInvitationStatusHistory(item.invitationId)
      .then((res: any) => {
        this.historyLoading = false;

        if (res?.isSuccess === false) {
          this.messageService.showErrorSweetAlert(
            res?.resultMessage || 'دریافت تاریخچه وضعیت با خطا مواجه شد.',
            'خطا',
          );
          return;
        }

        const rawItems = res?.data || res?.resultData || [];

        const historyItems: InvitationStatusHistoryViewModel[] = rawItems.map(
          (x: any) => ({
            invitationId: x.invitationId ?? 0,
            changeDateTime: x.changeDateTime || '',
            statusTitle: x.statusTitle || '',
            changedByUser: x.changedByUser || '',
            ranking: x.ranking || '',
            description: x.description || '',
          }),
        );

        this.dialog.open(StatusHistoryDialogComponent, {
          width: '780px',
          disableClose: true,
          panelClass: 'custom-dialog-container',
          data: {
            items: historyItems,
          },
        });
      })
      .catch(() => {
        this.historyLoading = false;
        this.messageService.showErrorSweetAlert(
          'دریافت تاریخچه وضعیت با خطا مواجه شد.',
          'خطا',
        );
      });
  }
  openDescriptionDialog(description: string): void {
    this.dialog.open(PublicationDescriptionDialogComponent, {
      width: '560px',
      maxWidth: '92vw',
      direction: 'rtl',
      data: { description },
    });
  }
  getDescriptionPreview(description: string): string {
    const text = this.normalizePersianText(description);
    const maxLength = 40;

    if (text.length <= maxLength) {
      return text;
    }

    return `${text.slice(0, maxLength)}...`;
  }
  shouldShowMore(description: string): boolean {
    return this.normalizePersianText(description).length > 40;
  }
}
