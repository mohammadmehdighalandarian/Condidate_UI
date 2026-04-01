import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/modules/share.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PoliticalStatusComponent } from './political-status.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";
import { ChangeStatusDaialogueComponent } from '../../dialogues/change-status-daialogue/change-status-daialogue.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { StatusHistoryDialogModule } from '../../dialogues/status-history-dialog/status-history-dialog.module';

const routes: Routes = [{ path: '', component: PoliticalStatusComponent }];

@NgModule({
  declarations: [PoliticalStatusComponent, ChangeStatusDaialogueComponent],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    ShareModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    StatusHistoryDialogModule
  ],
  exports: [RouterModule],
})
export class PoliticalStatusModule {}
