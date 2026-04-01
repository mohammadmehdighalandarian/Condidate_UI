import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StatusHistoryDialogComponent } from './status-history-dialog.component';

const routes: Routes = [{ path: '', component: StatusHistoryDialogComponent }];

@NgModule({
  declarations: [StatusHistoryDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ],
  exports: [RouterModule],
})
export class StatusHistoryDialogModule {}
