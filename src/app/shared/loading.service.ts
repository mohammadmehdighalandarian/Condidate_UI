import { Injectable, TemplateRef } from '@angular/core';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

const PrimaryWhite = '#ffffff';
const SecondaryGrey = '#ccc';
const PrimaryRed = '#dd0031';
const SecondaryBlue = '#006ddd';
const innerHtml = '';
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  showProgressbar = false;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public loading = true;
  public primaryColour = PrimaryWhite;
  public secondaryColour = SecondaryGrey;
  public coloursEnabled = false;
  public text: string = ''; //'SDP Management Panel';
  public loadingTemplate: TemplateRef<any>;
  public config = {
    animationType: ngxLoadingAnimationTypes.none,
    primaryColour: this.primaryColour,
    secondaryColour: this.secondaryColour,
    tertiaryColour: this.primaryColour,
    backdropBorderRadius: '3px',
  };

  show(text: string = '') {
    this.showProgressbar = true;
    if (text != '') {
      this.text = text;
    }
  }

  hide() {
    this.text = '';
    this.showProgressbar = false;
  }
}
