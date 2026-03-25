import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/modules/share.module';
import { PartyListManagementComponent } from './party-list-management.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule} from '@angular/cdk/drag-drop';
import { A11yModule } from '@angular/cdk/a11y';
import { CdkTableModule } from '@angular/cdk/table';

const routes: Routes = [{ path: '', component: PartyListManagementComponent }];

@NgModule({
  declarations: [PartyListManagementComponent],
  imports: [
      RouterModule.forChild(routes),
      ShareModule,
      MatTableModule,
      A11yModule,
      CdkTableModule,
      DragDropModule,
      MatIconModule
    ],
  exports: [RouterModule],
})
export class PartyListManagementModule {}
