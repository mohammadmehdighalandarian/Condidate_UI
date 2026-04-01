import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PublicationListComponent } from './publication-list.component';
import { ShareModule } from 'src/app/modules/share.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

const routes: Routes = [{ path: '', component: PublicationListComponent }];

@NgModule({
  declarations: [PublicationListComponent],
  imports: [
    CommonModule,
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
  ],
  exports: [RouterModule],
})
export class PublicationListModule { }
