import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/modules/share.module';
import { LandingPageComponent } from './landing-page.component';

const routes: Routes = [{ path: '', component: LandingPageComponent }];

@NgModule({
  declarations: [LandingPageComponent],
  imports: [RouterModule.forChild(routes), ShareModule],
  exports: [RouterModule,LandingPageComponent],
})
export class LandingPageModule {}
