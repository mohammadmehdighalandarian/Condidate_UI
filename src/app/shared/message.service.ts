import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    //    private toastr: ToastrService
  ) { }
  defaultTimeout = 3000;
  defaultConfig =
    {
      timeOut: this.defaultTimeout,
      tapToDismiss: true,
      positionClass: 'toast-bottom-right',
      progressBar: true,
      progressAnimation: 'increasing',
      closeButton: true
    }

  // showErrorToast(text: string, title: string = '', config: any = null) {
  //   if (config == null) {
  //     config = <IndividualConfig>this.defaultConfig;
  //   }
  //   this.toastr.error(text, title, config);
  // }
  // showWarningToast(text: string, title: string = '', config: any = null) {
  //   if (config == null) {
  //     config = <IndividualConfig>this.defaultConfig;
  //   }
  //   this.toastr.warning(text, title, config);
  // }

  // showInfoToast(text: string, title: string = '', config: any = null) {
  //   if (config == null) {
  //     config = <IndividualConfig>this.defaultConfig;
  //   }
  //   this.toastr.info(text, title, config);
  // }


  showConrifmSweetAlert(text: string, title: string = 'Attention', confirmButtonText: string = 'بله', cancelButtonText: string = 'خیر') {
    return new Promise((resole, reject) => {
      Swal.fire({
        title: title,
        html: text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText
      }).then((result: any) => {
        if (result.isConfirmed) {
          resole(true);
        } else {
          reject(false);
        }
      })
    })
  }
  showInformSweetAlert(text: string, title: string = 'Attention', confirmButtonText: string = 'Ok') {
    return new Promise((resole, reject) => {
      Swal.fire({
        title: title,
        html: text,
        icon: 'info',
        confirmButtonColor: '#3085d6',
        confirmButtonText: confirmButtonText
      }).then(() => {
        resole(true);
      })
    })
  }


  showErrorSweetAlert(text: string, title: string) {
    return new Promise((res) => {
      Swal.fire({
        title: title,
        html: text,
        icon: 'error',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      })
        .then(() => { res(true) });
    })


  }

  showSuccessSweetAlert(text: string = 'Operation completed successfully', title: string = '') {
    return new Promise((res) => {
      Swal.fire({
        title: title,
        text: text,
        icon: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      })
        .then(() => { res(true) });
    })

  }
}
