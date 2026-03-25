import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainSideMenuComponent } from './main-side-menu.component';
import { ShareModule } from 'src/app/modules/share.module';
import { SideMenuHeaderModule } from '../side-menu-header/side-menu-header.module';

const routes: Routes = [{ path: '', component: MainSideMenuComponent }];

@NgModule({
  declarations: [MainSideMenuComponent],
  imports: [RouterModule.forChild(routes), ShareModule,SideMenuHeaderModule],
  exports: [RouterModule,MainSideMenuComponent],
})
export class MainSideMenuModule {}