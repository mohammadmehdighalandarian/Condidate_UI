import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelInvitationDialogComponent } from './cancel-invitation-dialog.component';

describe('CancelInvitationDialogComponent', () => {
  let component: CancelInvitationDialogComponent;
  let fixture: ComponentFixture<CancelInvitationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelInvitationDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CancelInvitationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
