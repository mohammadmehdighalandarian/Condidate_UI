import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebPortalsComponent } from './web-portals.component';
import { ShareModule } from 'src/app/modules/share.module';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

const routes: Routes = [{ path: '', component: WebPortalsComponent }];

@NgModule({
  declarations: [WebPortalsComponent],
  imports: [RouterModule.forChild(routes), ShareModule,MatTableModule,MatIconModule,
    MatPaginatorModule,],
  exports: [RouterModule,],
  providers: [],

})
export class WebPortalsModule {}
