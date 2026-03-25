import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiDataResponse, ApiResponse } from 'src/app/models/base/apiDataRseponseModel';
import { SocialNetworks } from 'src/app/models/socialNetworksModel';
import { SocialNetworksService } from 'src/app/services/social-networks.service';

@Component({
  selector: 'app-social-networks',
  templateUrl: './social-networks.component.html',
  styleUrls: ['./social-networks.component.css'],
})
export class SocialNetworksComponent implements OnInit {
  newSocialNetwork: SocialNetworks = new SocialNetworks();
  socialNetworks: SocialNetworks[] = [];
  dataSource = new MatTableDataSource<SocialNetworks>();
  displayedColumns: string[] = [
    'title',
    'url',
    'statusDesc',
    'actions',
  ];

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, {}) paginator: MatPaginator;
  constructor(private socialNetworksService: SocialNetworksService) {}
  response: ApiResponse;

  ngOnInit() {
    this.getSocialNetworks();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getSocialNetworks() {
    this.socialNetworksService
      .getSocialNetworks()
      .then((result: ApiDataResponse<SocialNetworks[]>) => {
        this.socialNetworks = result.data;
        this.dataSource.data = this.socialNetworks;
      }).catch((error)=>{});

  }

  deleteSocialNetwork(id: string) {
    var model = new SocialNetworks();
    model.id = id;
    this.socialNetworksService.deleteSocialNetwork(model).then((result) => {
      this.getSocialNetworks();
    }).catch((error)=>{});

  }


  addSocialNetwork() {
    this.socialNetworksService
      .addSocialNetwork(this.newSocialNetwork)
      .then(() => {
        this.getSocialNetworks();
        this.resetForm() ;
      }).catch((error)=>{});

  }

  resetForm() {
    this.newSocialNetwork = new SocialNetworks();
  }
}
