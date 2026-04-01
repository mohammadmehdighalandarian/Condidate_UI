import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FooterComponent } from './footer.component';
import { ShareModule } from 'src/app/modules/share.module';

const routes: Routes = [{ path: '', component: FooterComponent }];

@NgModule({
  declarations: [FooterComponent],
  imports: [RouterModule.forChild(routes), ShareModule],
  exports: [RouterModule,FooterComponent],
})
export class FooterModule {}