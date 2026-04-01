import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InvitationStatusHistoryViewModel } from 'src/app/models/invitation/invitationStatusHistoryViewModel';

@Component({
  selector: 'app-status-history-dialog',
  templateUrl: './status-history-dialog.component.html',
  styleUrls: ['./status-history-dialog.component.css'],
})
export class StatusHistoryDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<StatusHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { items: InvitationStatusHistoryViewModel[] },
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  getChangedByUserTitle(value: string | null | undefined): string {
  if (!value) return '-';

  switch (value) {
    case 'PARTY_SECRETARY':
      return 'دبیر حزب';
    case 'CANDIDATE':
      return 'کاندید';
    default:
      return ' ';
  }
}
}
