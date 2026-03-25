import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InvitationStatus } from 'src/app/enums/enums';
import { ApiDataResponse } from 'src/app/models/base/apiDataRseponseModel';
import { party } from 'src/app/models/party';
import { invitation } from 'src/app/models/partyList/Invitation/invitation';
import { PoliticalStatusService } from 'src/app/services/political-status.service';

@Component({
  selector: 'app-political-status',
  templateUrl: './political-status.component.html',
  styleUrls: ['./political-status.component.css']
})
export class PoliticalStatusComponent implements OnInit {
  dataSource = new MatTableDataSource<invitation>();
  displayedColumns: string[] = [
    'order',
    'invitationDate',
    'partyName',
    'statusTitle',
    'ranking',
    'actions',
  ];
  partyName = "";
  hasConfirmedInivitation = false;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator; 
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  get InvitationStatus() {
    return InvitationStatus;
  }
  constructor(private politicalStatusService: PoliticalStatusService) {}
  ngOnInit() {
    this.getPartyName();
    this.getCandidateInvitations();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getCandidateInvitations() {
      this.politicalStatusService.getCandidateInvitations()
        .then((result: ApiDataResponse<invitation[]>) => {
          this.hasConfirmedInivitation = result.data.some(x=>x.status == InvitationStatus.Confirmed)
          this.dataSource.data = result.data;
        }).catch((error)=>{});
  
  }
  getPartyName() {
      this.politicalStatusService.getCandidateParty()
        .then((result:ApiDataResponse<party>) => {
          this.partyName = result.data.partyTitle;
        }).catch((error)=>{});
  }
  changeStatus(invitation: invitation){
    console.log(invitation);
  }
  showHistory(invitation: invitation){
    console.log(invitation);
  }
  applyFilter(event) {
    let filterValue = event.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
