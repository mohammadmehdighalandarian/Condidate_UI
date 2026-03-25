import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AcceptLaws } from 'src/app/models/acceptLawsModel';
import {
  ApiDataResponse,
  ApiResponse,
} from 'src/app/models/base/apiDataRseponseModel';
import { AcceptLawsService } from 'src/app/services/accept-laws.service';

@Component({
  selector: 'app-accept-laws',
  templateUrl: './accept-laws.component.html',
  styleUrls: ['./accept-laws.component.css'],
})
export class AcceptLawsComponent implements OnInit {
  constructor(private acceptLawsService: AcceptLawsService, private router: Router ) {}
  response: ApiResponse;
  acceptLaws: AcceptLaws = new AcceptLaws();
  acceptLawsControl = new FormControl(false);
  hasAccepted:boolean=false;
  ngOnInit() {
    this.checkLawAcceptance();
    this.loadContractText();
  }

  checkLawAcceptance() {
    this.acceptLawsService
      .checkLawAcceptance()
      .then((result: ApiDataResponse<boolean>) => {
        if (result.isSuccess) {
          this.acceptLaws.hasAccepted = result.data;
        } else {
          this.acceptLaws.hasAccepted = false;
        }
      }).catch((error)=>{});

  }

  setAcceptance() {
    this.acceptLawsService
    .setAcceptance()
    .then((result: ApiDataResponse<boolean>) => {
      this.router.navigate(['/mainPage']);
    }).catch((error)=>{});
  }

  loadContractText() {
    this.acceptLawsService
      .getContractText()
      .then((response: ApiDataResponse<string>) => {
        if (response.isSuccess) {
          this.acceptLaws.contractText = response.data;
        }
      }).catch((error)=>{});

  }
}
