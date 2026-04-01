import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PublicationRequestCandidateItem, PublicationRequestItem } from 'src/app/models/publicationRequest/publication-request.model';
import { PublicationRequestService } from 'src/app/services/publication-request.service';
import { FileExcelService } from 'src/app/shared/FileExcelService';
import { MessageService } from 'src/app/shared/message.service';
import { PublicationDescriptionDialogComponent } from '../dialogues/publication-request-dialog/publication-description-dialog.component';

@Component({
  selector: 'app-publication-requests',
  templateUrl: './publication-requests.component.html',
  styleUrls: ['./publication-requests.component.css'],
})
export class PublicationRequestsComponent implements OnInit {
  loading = false;
  searchText = '';

  displayedColumns: string[] = [
    'rowNumber',
    'requestDate',
    'statusTitle',
    'provinceTitle',
    'electionZoneTitle',
    'description',
    'actions',
  ];

  dataSource = new MatTableDataSource<PublicationRequestItem>([]);
  maxCellLength = 40

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(
    private publicationRequestService: PublicationRequestService,
    private excelService: FileExcelService,
    private messageService: MessageService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.dataSource.filterPredicate = (data, filter) => {
      const rowText = this.normalizePersianText(
        [
          data.rowNumber,
          data.sendDate,
          data.statusTitle,
          data.province,
          data.electionZoneTitle,
          data.description,
        ]
          .filter(Boolean)
          .join(' '),
      ).toLowerCase();

      return rowText.includes(filter);
    };


    this.loadPublicationRequests();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPublicationRequests() {
    this.loading = true;

    this.publicationRequestService
      .getPublicationRequests(this.searchText)
      .then((response: any) => {
        const rawItems = response?.data || response?.resultData || [];

        const mappedData: PublicationRequestItem[] = (rawItems || []).map(
          (item: any, index: number) => ({
            publicationRequestId:
               item.id || 0,
            rowNumber: index + 1,
            provinceId:item.provinceId || 0,
            requestDate:this.formatRequestDate(item.sendDate || ''),
            statusTitle: item.statusTitle || '',
            provinceTitle: item.province || '',
            electionZoneTitle: item.zoneTitle || '',
            zoneId:item.zoneId || 0,
            electionType:item.electionType || 0,
            description: item.description || '',
          }),
        );

        this.dataSource.data = mappedData;
      })
      .catch(() => {
        this.dataSource.data = [];
        this.messageService.showErrorSweetAlert(
          'دریافت درخواست‌های انتشار با خطا مواجه شد.',
          'خطا',
        );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement)?.value || '';
    this.searchText = value;
   
    this.dataSource.filter = this.normalizePersianText(value).toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  downloadCandidates(item: PublicationRequestItem): void {
    this.publicationRequestService
      .getPublicationRequestCandidates(item.publicationRequestId)
      .then((response: any) => {
        const rawItems = response?.data || response?.resultData || [];

        const candidates: PublicationRequestCandidateItem[] =
          (rawItems || []).map((candidate: any) => ({
            code: candidate.code || '',
            fullName:`${candidate.firstName || ''} ${candidate.lastName || ''}`,
            provinceTitle: candidate.provinceTitle,
            zoneTitle: candidate.zoneTitle || '',
          }));

        if (!candidates.length) {
          this.messageService.showErrorSweetAlert(
            'نامزدی برای دانلود یافت نشد.',
            'خطا',
          );
          return;
        }

        const excelData = candidates.map((x) => ({
          'کد نامزد': x.code,
          'نام و نام خانوادگی نامزد': x.fullName,
          استان: x.provinceTitle,
          'حوزه انتخابی': x.ZoneTitle,
        }));

        this.excelService.SaveToExcel(
          excelData,
          `لیست-نامزدها-${item.electionZoneTitle}`,
        );
      })
      .catch(() => {
        this.messageService.showErrorSweetAlert(
          'دانلود لیست نامزدها با خطا مواجه شد.',
          'خطا',
        );
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

  openDescriptionDialog(description: string): void {
    this.dialog.open(PublicationDescriptionDialogComponent, {
      width: '560px',
      maxWidth: '92vw',
      direction: 'rtl',
      data: { description },
    });
  }
formatRequestDate(value: string): string {
    const text = this.normalizePersianText(value);

    if (!text) {
      return '';
    }

    if (text.includes(' - ')) {
      return text.split(' - ')[0].trim();
    }

    if (text.includes('T')) {
      return text.split('T')[0].trim();
    }

    return text.split(' ')[0].trim();
  }

  normalizePersianText(value: any): string {
    return String(value || '')
      .replace(/[يى]/g, 'ی')
      .replace(/ك/g, 'ک')
      .replace(/\s+/g, ' ')
      .replace(/(^|\s)ا/g, '$1آ')
      .trim();
  }

}
