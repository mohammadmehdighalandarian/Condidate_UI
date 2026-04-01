import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ShareModule } from 'src/app/modules/share.module';
import { PublicationRequestsComponent } from './publication-requests.component';
import { PublicationDescriptionDialogModule } from '../dialogues/publication-request-dialog/publication-description-dialog.component.module';

const routes: Routes = [{ path: '', component: PublicationRequestsComponent }];

@NgModule({
  declarations: [PublicationRequestsComponent],
  imports: [
    RouterModule.forChild(routes),
    ShareModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    PublicationDescriptionDialogModule,
  ],
  exports: [RouterModule],
})
export class PublicationRequestsModule {}
