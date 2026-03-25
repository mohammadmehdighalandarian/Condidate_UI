import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BiographyComponent } from './biography.component';
import { ShareModule } from 'src/app/modules/share.module';
import { NgxSummernoteModule } from 'ngx-summernote';

const routes: Routes = [{ path: '', component: BiographyComponent }];

@NgModule({
  declarations: [BiographyComponent],
  imports: [RouterModule.forChild(routes), ShareModule,NgxSummernoteModule],
  exports: [RouterModule],
})
export class BiographyModule {}
