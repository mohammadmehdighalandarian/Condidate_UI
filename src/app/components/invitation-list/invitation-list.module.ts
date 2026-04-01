import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/modules/share.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { InvitationListComponent } from './invitation-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StatusHistoryDialogModule } from '../dialogues/status-history-dialog/status-history-dialog.module';

const routes: Routes = [{ path: '', component: InvitationListComponent }];

@NgModule({
  declarations: [InvitationListComponent],
  imports: [
    RouterModule.forChild(routes),
    ShareModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule, // Add this
    MatSelectModule, // Add this
    MatInputModule, // Add this
    MatOptionModule, // Add this
    StatusHistoryDialogModule
  ],
  exports: [RouterModule],
})
export class InvitationListModule {}
