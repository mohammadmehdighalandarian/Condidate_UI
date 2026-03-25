import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { WebPortalsModel } from 'src/app/models/WebPortalsModel';
import { ApiDataResponse, ApiResponse } from 'src/app/models/base/apiDataRseponseModel';
import { WebPortalService } from 'src/app/services/web-portal.service';
@Component({
  selector: 'app-web-portals',
  templateUrl: './web-portals.component.html',
  styleUrls: ['./web-portals.component.css'],
})
export class WebPortalsComponent implements OnInit {
  webPortal: WebPortalsModel = new WebPortalsModel();
  WebPortals: WebPortalsModel[] = [];
  dataSource = new MatTableDataSource<WebPortalsModel>();
  displayedColumns: string[] = [
    'title',
    'url',
    'statusDesc',
    'actions',
  ];

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, {}) paginator: MatPaginator;

  constructor(private webPortalService: WebPortalService) {}
  ngOnInit(): void {
    this.getURLs();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  webPortalsModel: WebPortalsModel[] = [];
  webPortalsModelInsert: WebPortalsModel;
  getURLs() {
    this.webPortalService
      .getURLs()
      .then((result: ApiDataResponse<WebPortalsModel[]>) => {
        this.webPortalsModel = result.data;
        this.dataSource.data = this.webPortalsModel;
      }).catch((error)=>{});

  }

  response: ApiResponse;

  insertURL() {
    if (this.webPortal) {
      this.webPortalService
        .insertURL(this.webPortal)
        .then((resp: ApiResponse) => {
          this.response = resp;
          this.getURLs();
          this.resetForm() ;
        }).catch((error)=>{});

    }
  }

  deleteURL(id: string) {
    var model = new WebPortalsModel();
    model.id = id;
    this.webPortalService.deleteURL(model).then((result) => {
      this.getURLs();
    }).catch((error)=>{});

  }
  resetForm() {
    this.webPortal = new WebPortalsModel();
  }
}
