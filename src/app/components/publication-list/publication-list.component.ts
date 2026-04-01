import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiDataResponse } from 'src/app/models/base/apiDataRseponseModel';
import { PublicationListsViewModel } from 'src/app/models/publicationList/publicationListsViewModel';
import { CommonService } from 'src/app/services/common.service';
import { PublicationListService } from 'src/app/services/publication-list.service';
import { FileExcelService } from 'src/app/shared/FileExcelService';
import { MessageService } from 'src/app/shared/message.service';

@Component({
  selector: 'app-publication-list',
  templateUrl: './publication-list.component.html',
  styleUrls: ['./publication-list.component.css']
})
export class PublicationListComponent implements OnInit {

  searchText: string = '';

  publicationLists: PublicationListsViewModel[] = [];

  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;

  dataSource = new MatTableDataSource<PublicationListsViewModel>(
    this.publicationLists,
  );

  displayedColumns: string[] = [
    'sendDate',
    'partyCode',
    'partyFullName',
    'secretaryFullName',
    'province',
    'zoneTitle',
    'statusTitle',
    'description',
    'actions',
  ];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private service: PublicationListService,
    private commonService: CommonService,
    private messageService: MessageService,
    private fileExcelService: FileExcelService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadPublicationLists();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  reloadList(){
    this.loadPublicationLists();
  }

  private loadPublicationLists() {
    this.service.getPublicationLists().then((result: ApiDataResponse<PublicationListsViewModel[]>) => {
      result.data.forEach(x=>{
        x.description = this.normalizePersianText(x.description);
        x.partyFullName = this.normalizePersianText(x.partyFullName);
        x.province = this.normalizePersianText(x.province);
        x.secretaryFullName = this.normalizePersianText(x.secretaryFullName);
        x.zoneTitle = this.normalizePersianText(x.zoneTitle);
      });

      this.dataSource.data = result.data;      
      this.totalItems = result.data.length;
    }).catch((error) => {
      console.error('Error loading invitations', error);
      this.publicationLists = [];
      this.dataSource.data = [];
      this.totalItems = 0;
    });
  }

  downloadExcelFile(): void {
    const excelData = this.createExcelData(this.dataSource.filteredData);
    debugger;
    if (!excelData || excelData.length === 0) {
      this.messageService.showErrorSweetAlert(
        'داده‌ای برای خروجی اکسل یافت نشد.',
        'خطا',
      );
      return;
    }

    this.fileExcelService.SaveToExcel(excelData, 'لیست درخواست‌ها');
  }
  createExcelData(data: any[]): any[] {
    return (data || []).map((item) => ({
      'زمان ثبت درخواست': item.sendDate || '',
      'کد حزب': item.partyCode || '',
      'نام حزب': item.partyFullName ,
      'نام دبیر حزب': item.secretaryFullName || '',
      'استان': item.province || '',
      'حوزه انتخابی': item.zoneTitle || '',
      'وضعیت': item.statusTitle || '',
      'توضیحات': item.description || '',
    }));
  }

  normalizePersianText(value: string): string {
    return String(value || '')
      .replace(/[يى]/g, 'ی')
      .replace(/ك/g, 'ک')
      .replace(/\s+/g, ' ')
      .trim();
  }


  applyFilter(event) {
    let filterValue = event.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDetailDialog(publicationList:any){
    console.log(publicationList);

  }
}



