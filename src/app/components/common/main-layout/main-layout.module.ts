import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/modules/share.module';
import { MainLayoutComponent } from './main-layout.Component';
import { FooterModule } from '../footer/footer.module';
import { TopNavBarModule } from '../top-nav-bar/top-nav-bar.module';
import { MainSideMenuModule } from '../main-side-menu/main-side-menu.module';

const routes: Routes = [{ path: '', component: MainLayoutComponent }];

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [
    RouterModule.forChild(routes),
    ShareModule,
    TopNavBarModule,
    MainSideMenuModule,
  ],
  exports: [RouterModule, MainLayoutComponent],
})
export class MainLayoutModule {}
