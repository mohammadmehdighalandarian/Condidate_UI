import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/modules/share.module';
import { AcceptLawsComponent } from './accept-laws.component';

const routes: Routes = [{ path: '', component: AcceptLawsComponent }];

@NgModule({
  declarations: [AcceptLawsComponent],
  imports: [RouterModule.forChild(routes), ShareModule],
  exports: [RouterModule],
  providers: [],

})
export class AcceptLawsModule {}