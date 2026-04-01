import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-invitation-dialog',
  templateUrl: './cancel-invitation-dialog.component.html',
  styleUrls: ['./cancel-invitation-dialog.component.css']
})
export class CancelInvitationDialogComponent {
  description = '';

  constructor(
    public dialogRef: MatDialogRef<CancelInvitationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.description = data?.description || '';
  }

  submit() {
    const description = (this.description || '').trim();
    if (!description) {
      return;
    }

    this.dialogRef.close({ description });
  }

  close() {
    this.dialogRef.close();
  }
}