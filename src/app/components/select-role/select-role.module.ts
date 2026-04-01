import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/modules/share.module';
import { SelectRoleComponent } from './select-role.component';

const routes: Routes = [{ path: '', component: SelectRoleComponent }];

@NgModule({
  declarations: [SelectRoleComponent],
  imports: [RouterModule.forChild(routes), ShareModule],
  exports: [RouterModule,SelectRoleComponent]
})
export class SelectRoleModule { }
