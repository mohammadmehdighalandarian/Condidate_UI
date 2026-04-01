import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InvitationStatus } from 'src/app/enums/enums';
import { PoliticalStatusService } from 'src/app/services/political-status.service';

@Component({
  selector: 'app-change-status-daialogue',
  templateUrl: './change-status-daialogue.component.html',
  styleUrls: ['./change-status-daialogue.component.css']
})
export class ChangeStatusDaialogueComponent implements OnInit {
  model = {status:null,description:""}
  statusList = [
                {name:"درخواست دعوت را می‌پذیرم",value:InvitationStatus.Confirmed},
                {name:"درخواست دعوت را نمی‌پذیرم",value:InvitationStatus.Rejected}
              ]
  constructor(private dialogRef: MatDialogRef<ChangeStatusDaialogueComponent>,
    private service: PoliticalStatusService,
    @Inject(MAT_DIALOG_DATA) private data) { 
    dialogRef.disableClose = true;
  }
  get InvitationStatus() {
    return InvitationStatus;
  }
  ngOnInit() {
  }
  changeStatus() {
    this.service.changeInvitationStatus({
        invitationId: this.data.invitationId,
        status: this.model.status,
        description: this.model.description
      })
      .then((resp) => {
        this.dialogRef.close(resp);
      })
      .catch((error: any) => {})
      .finally(() => {});
  }
}