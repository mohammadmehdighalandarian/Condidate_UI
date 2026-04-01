import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopNavBarComponent } from './top-nav-bar.component';
import { ShareModule } from 'src/app/modules/share.module';

const routes: Routes = [{ path: '', component: TopNavBarComponent }];

@NgModule({
  providers: [],
  declarations: [TopNavBarComponent],
  imports: [RouterModule.forChild(routes), 
    ShareModule],
  exports: [RouterModule,TopNavBarComponent],

})
export class TopNavBarModule {}