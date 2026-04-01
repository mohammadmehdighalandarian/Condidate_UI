import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InvitationStatus } from 'src/app/enums/enums';

@Component({
  selector: 'app-delete-invitation-dialogue',
  templateUrl: './delete-invitation-dialogue.component.html',
  styleUrls: ['./delete-invitation-dialogue.component.css']
})
export class DeleteInvitationDialogComponent {
  description = '';
  status = null;

  constructor(
    public dialogRef: MatDialogRef<DeleteInvitationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.status = data;
  }
  get InvitationStatus() {
      return InvitationStatus;
  }

  submit() {
    const description = (this.description || '').trim();
    this.dialogRef.close({ description });
  }

  close() {
    this.dialogRef.close();
  }
}