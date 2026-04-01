import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SideMenuHeaderComponent } from './side-menu-header.component';
import { ShareModule } from 'src/app/modules/share.module';

const routes: Routes = [{ path: '', component: SideMenuHeaderComponent }];

@NgModule({
  declarations: [SideMenuHeaderComponent],
  imports: [RouterModule.forChild(routes), ShareModule],
  exports: [RouterModule,SideMenuHeaderComponent],
})
export class SideMenuHeaderModule {}