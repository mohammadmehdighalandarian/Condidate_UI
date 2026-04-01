import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/modules/share.module';
import { CandidateInfoComponent } from './candidate-info.component';

const routes: Routes = [{ path: '', component: CandidateInfoComponent }];

@NgModule({
  declarations: [CandidateInfoComponent],
  imports: [RouterModule.forChild(routes), ShareModule],
  exports: [RouterModule,CandidateInfoComponent],
})
export class CandidateInfoModule {}
