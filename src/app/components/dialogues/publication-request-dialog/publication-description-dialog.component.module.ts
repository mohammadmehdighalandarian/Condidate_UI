import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { PublicationDescriptionDialogComponent } from './publication-description-dialog.component';

@NgModule({
  declarations: [PublicationDescriptionDialogComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  exports: [PublicationDescriptionDialogComponent],
})
export class PublicationDescriptionDialogModule {}
