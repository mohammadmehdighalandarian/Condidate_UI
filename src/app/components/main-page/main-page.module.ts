import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page.component';
import { ShareModule } from 'src/app/modules/share.module';

const routes: Routes = [{ path: '', component: MainPageComponent }];

@NgModule({
  declarations: [MainPageComponent],
  imports: [RouterModule.forChild(routes), ShareModule],
  exports: [RouterModule],
  providers: [],

})
export class MainPageModule {}