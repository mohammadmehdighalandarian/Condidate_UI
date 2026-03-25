import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SocialNetworksComponent } from './social-networks.component';
import { ShareModule } from 'src/app/modules/share.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [{ path: '', component: SocialNetworksComponent }];

@NgModule({
  declarations: [SocialNetworksComponent],
  imports: [
    RouterModule.forChild(routes),
    ShareModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatTooltipModule,
    MatIconModule
  ],
  exports: [RouterModule],
})
export class SocialNetworksModule {}
