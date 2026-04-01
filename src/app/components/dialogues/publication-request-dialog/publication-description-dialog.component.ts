import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-publication-description-dialog',
  templateUrl: './publication-description-dialog.component.html',
  styleUrls: ['./publication-description-dialog.component.css'],
})
export class PublicationDescriptionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PublicationDescriptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { description: string },
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
