import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InvitationStatus } from 'src/app/enums/enums';
import { ApiDataResponse } from 'src/app/models/base/apiDataRseponseModel';
import { party } from 'src/app/models/party';
import { invitation } from 'src/app/models/partyList/Invitation/invitation';
import { PoliticalStatusService } from 'src/app/services/political-status.service';
import { ChangeStatusDaialogueComponent } from '../../dialogues/change-status-daialogue/change-status-daialogue.component';
import { InvitationStatusHistoryViewModel } from 'src/app/models/invitation/invitationStatusHistoryViewModel';
import { StatusHistoryDialogComponent } from '../../dialogues/status-history-dialog/status-history-dialog.component';
import { MessageService } from 'src/app/shared/message.service';
import { PublicationDescriptionDialogComponent } from '../../dialogues/publication-request-dialog/publication-description-dialog.component';

@Component({
  selector: 'app-political-status',
  templateUrl: './political-status.component.html',
  styleUrls: ['./political-status.component.css']
})
export class PoliticalStatusComponent implements OnInit {
  dataSource = new MatTableDataSource<invitation>();
  maxCellLength = 40
  displayedColumns: string[] = [
    'order',
    'invitationDate',
    'partyName',
    'statusTitle',
    'ranking',
    'description',
    'actions',
  ];
  partyName = "";
  historyLoading: boolean;
  hasConfirmedInivitation = false;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator; 
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  get InvitationStatus() {
    return InvitationStatus;
  }
  constructor(private politicalStatusService: PoliticalStatusService,
              private messageService: MessageService,
              private dialog: MatDialog) {}
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
    this.dialog.open(ChangeStatusDaialogueComponent, {
                          data: invitation,
                          width: "420px",
                          panelClass: 'custom-dialog-container',
                          //height:"800px",
                          //minWidth: '300px'
                        }).afterClosed().subscribe((res) => {
      if(res && res.isSuccess){
        this.getCandidateInvitations();
      }
    });
  }

  openStatusHistoryDialog(invitation: invitation) {
    if (!invitation?.invitationId) {
      this.messageService.showErrorSweetAlert(
        'شناسه دعوت‌نامه معتبر نیست.',
        'خطا',
      );
      return;
    }
  
    this.historyLoading = true;
  
    this.politicalStatusService
      .getInvitationStatusHistory(invitation.invitationId)
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
          maxWidth: '95vw',
          disableClose: true,
          direction: 'rtl',
          panelClass: 'history-dialog-panel',
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
  applyFilter(event) {
    let filterValue = event.target.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
   openDescriptionDialog(description: string): void {
      this.dialog.open(PublicationDescriptionDialogComponent, {
        width: '560px',
        maxWidth: '92vw',
        direction: 'rtl',
        data: { description },
      });
  }
}
