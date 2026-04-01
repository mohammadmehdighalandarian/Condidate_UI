import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeleteInvitationDialogComponent } from './delete-invitation-dialogue.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

const routes: Routes = [{ path: '', component: DeleteInvitationDialogComponent }];

@NgModule({
  declarations: [DeleteInvitationDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ],
  exports: [RouterModule],
})
export class DeleteInvitationDialogModule {}
