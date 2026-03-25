import { HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularAlertType } from "src/app/enums/enums";
import { ApiCallModel } from "src/app/models/base/apiCallModel";
import Swal from "sweetalert2";
import { ApiOptionsService } from "./api-options.service";
import { AuthService } from "./auth.service";
import { LoadingService } from "./loading.service";

@Injectable({
  providedIn: 'root'
})
export class ApiHelperService {
  RequestCount: number = 0;
  // search for singelton angular service injection
  constructor(
    private httpCall: HttpClient,
    private loadingService: LoadingService,
    private router: Router,
    private apiOptions: ApiOptionsService,
    private authService: AuthService,
  ) {
    try {
      this.RequestCount = parseInt(localStorage.getItem("RequestCount")!);
      if (Number.isNaN(this.RequestCount)) {
        this.RequestCount = 0;
        localStorage.setItem("RequestCount", this.RequestCount.toString());
      }

    } catch (error) {
      this.RequestCount = 0;
      localStorage.setItem("RequestCount", this.RequestCount.toString());
    }

  }



  incressRequestCount() {
    this.RequestCount++;
    localStorage.setItem("RequestCount", this.RequestCount.toString());

  }

  resetRequestCount() {
    this.RequestCount = 0;
    localStorage.setItem("RequestCount", this.RequestCount.toString());

  }


  get(model: ApiCallModel) {
    this.incressRequestCount();
    return new Promise((resolve, reject) => {
      if (model.showConfirmAlert) {
        Swal.fire({
          title: model.confirmTitleText,
          html: model.confirmAlertText,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'بله',
          cancelButtonText: "خیر"
        }).then((result: any) => {
          if (result.isConfirmed) {
            this.getRequest(model)
              .then((data) => { resolve(data) })
              .catch((error) => { reject(error) });
          } else {
            resolve(true);
          }
        })
      } else {
        this.getRequest(model)
          .then((data) => { resolve(data) })
          .catch((error) => { reject(error) });
      }
    })

  }

  post(model: ApiCallModel) {
    this.incressRequestCount();
    return new Promise((resolve, reject) => {
      if (model.showConfirmAlert) {
        Swal.fire({
          title: model.confirmTitleText,
          html: model.confirmAlertText,
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'بله',
          cancelButtonText: "خیر"
        }).then((result: any) => {
          if (result.isConfirmed) {
            this.postRequest(model)
              .then((data) => { resolve(data) })
              .catch((error) => { reject(error) });
          } else {
            resolve(true);
          }
        })
      } else {
        this.postRequest(model)
          .then((data) => { resolve(data) })
          .catch((error) => { reject(error) });
      }
    })
  }

  // put(model: ApiCallModel) {
  //   this.incressRequestCount();
  //   return new Promise((resolve, reject) => {
  //     if (model.showConfirmAlert) {
  //       Swal.fire({
  //         title: model.confirmTitleText,
  //         html: model.confirmAlertText,
  //         icon: 'question',
  //         showCancelButton: true,
  //         confirmButtonColor: '#3085d6',
  //         cancelButtonColor: '#d33',
  //         confirmButtonText: 'بله',
  //         cancelButtonText: "خیر"
  //       }).then((result: any) => {
  //         if (result.isConfirmed) {
  //           this.putRequest(model)
  //             .then((data) => { resolve(data) })
  //             .catch((error) => { reject(error) });
  //         } else {
  //           resolve(true);
  //         }
  //       })
  //     } else {
  //       this.putRequest(model)
  //         .then((data) => { resolve(data) })
  //         .catch((error) => { reject(error) });
  //     }
  //   })
  // }

  // delete(model: ApiCallModel) {
  //   this.incressRequestCount();

  //   return new Promise((resolve, reject) => {
  //     if (model.showConfirmAlert) {

  //       Swal.fire({
  //         title: model.confirmTitleText,
  //         html: model.confirmAlertText,
  //         icon: 'question',
  //         showCancelButton: true,
  //         confirmButtonColor: '#3085d6',
  //         cancelButtonColor: '#d33',
  //         confirmButtonText: 'بله',
  //         cancelButtonText: "خیر"
  //       }).then((result: any) => {
  //         if (result.isConfirmed) {
  //           this.deleteRequest(model)
  //             .then((data) => { resolve(data) })
  //             .catch((error) => { reject(error) });
  //         } else {
  //           resolve(true);
  //         }
  //       })
  //     } else {
  //       this.deleteRequest(model)
  //         .then((data) => { resolve(data) })
  //         .catch((error) => { reject(error) });
  //     }
  //   })
  // }

  private CanCallApi(url: any) {
    return new Promise((resolve, reject) => {

      resolve(true);

      // if (!url.toString().toLowerCase().includes('login')) {
      //   if (!this.authService.isTokenValid()) {
      //     this.authService.logOut();
      //     reject(false);
      //   } else {
      //     if (url.toString().toLowerCase().includes('accessright/getcurrentuserdata')) {
      //       resolve(true);
      //     } else {
      //       if (this.RequestCount > 25) {
      //         this.resetRequestCount();
      //         this.getUserData()
      //           .then((response: any) => {
      //             localStorage["CurrentUser"] = JSON.stringify(response.data);
      //             // this.dataServiceService.SetUserAccess();
      //             resolve(true);
      //           })
      //           .catch(error => {
      //             this.authService.logOut();
      //             reject(false);
      //           })
      //       } else {
      //         resolve(true);
      //       }
      //     }
      //   }
      // } else {
      //   resolve(true);
      // }

    })
  }

  private handleSuccessResopne(success: any, options: ApiCallModel) {
    return new Promise((resolve, reject) => {
      this.loadingService.hide();
      delete success.userInfo;
      if (success.isSuccess) {
        if (options.showNoDataAlert && success.data && success.data.length == 0) {
          if (options.successAlertType == AngularAlertType.Swal) {
            Swal.fire({
              title: 'اطلاعاتی یافت نشد',
              text: '',
              icon: 'warning',
              showCancelButton: false,
              confirmButtonText: 'Ok',
            });
          } else {
            // this.toastr.warning('اطلاعاتی یافت نشد', '',
            //   {
            //     timeOut: 5000,
            //     tapToDismiss: true,
            //     positionClass: 'toast-bottom-left',
            //     progressBar: true,
            //     progressAnimation: 'increasing',
            //     closeButton: true
            //   });
          }

          resolve(success);
        }
        if (options.showSuccessAlert) {
          if (!success.resultMessage || success.resultMessage.length == 0) {
            success.resultMessage = 'Operation completed successfully'
          }
          if (options.successAlertType == AngularAlertType.Swal) {
            if (options.resolveAfterMessage) {

              Swal.fire({
                title: '',
                text: success.resultMessage,
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
              }).then((swalRes) => {
                resolve(success);
              });
            } else {
              Swal.fire({
                title: '',
                text: success.resultMessage,
                icon: 'success',
                showCancelButton: false,
                confirmButtonText: 'Ok',
              });

              resolve(success);
            }

          } else {
            // this.toastr.success(success.resultMessage, '',
            //   {
            //     timeOut: 5000,
            //     tapToDismiss: true,
            //     positionClass: 'toast-bottom-left',
            //     progressBar: true,
            //     progressAnimation: 'increasing',
            //     closeButton: true
            //   });
            resolve(success);
          }


        } else {
          resolve(success);
        }
      } else {
        if (options.showErrorAlert) {
          if (!success.resultMessage || success.resultMessage.length == 0) {
            success.resultMessage = 'Operation encountered error'
          }
          if (options.errorAlertType == AngularAlertType.Swal) {
            if (options.resolveAfterMessage) {
              Swal.fire({
                title: '',
                text: success.resultMessage,
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: 'Ok',
              }).then((swalRes) => {
                reject(success);
              });
            } else {
              Swal.fire({
                title: '',
                text: success.resultMessage,
                icon: 'error',
                showCancelButton: false,
                confirmButtonText: 'Ok',
              })
              reject(success);
            }

          } else {
            // this.toastr.error(success.resultMessage, '',
            //   {
            //     timeOut: 5000,
            //     tapToDismiss: true,
            //     positionClass: 'toast-bottom-left',
            //     progressBar: true,
            //     progressAnimation: 'increasing',
            //     closeButton: true
            //   });
            reject(success);

          }
        }
      }
    })
  }

  private handleError(response: any, option: ApiCallModel) {

    return new Promise((resolve) => {

      this.loadingService.hide();
      switch (response.status) {
        case 401:
          this.authService.logOut();
          break;
        case 404:
          //this.router.navigate(['error/404']);
          break;
        case 500:
          Swal.fire({
            title: 'خطا',
            text: "لطفا اطلاعات وارد شده را بررسی و مجددا تلاش نمایید",
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'Ok',
          })
          //this.router.navigate(['error/500']);
          break;
        case 403:
          Swal.fire({
            title: 'Insufficient Permission',
            text: "You do not have the necessary permission for the specified Page to perform the requested action",
            icon: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
          }).then(() => {
            if (option.redirectToPageWhenForbidden) {
              this.router.navigate([option.forbiddenUrl]);
            }
          });
          break;
        case 0:

          Swal.fire({
            title: 'Error',
            text: 'Error establishing a connection',
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'ok',
          });
          break;
        default:
          Swal.fire({
            title: 'Error',
            text: 'System Error Code : ' + response.status,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'Ok',
          });
          break;
      }
      // var guid = Guid.create();


      // localStorage.setItem('supportLog_request_' + guid.toString(), JSON.stringify(option));
      // localStorage.setItem('supportLog_reponse_' + guid.toString(), JSON.stringify(response));
      resolve(response);


    })
  }

  private getRequest(model: ApiCallModel) {
    return new Promise((resolve, reject) => {
      if (!model.options) {
        model.options = this.apiOptions.getOptions();
      }
      this.CanCallApi(model.url).then(() => {
        if (model.showLoading) {
          this.loadingService.show();
        }
        let url = model.baseUrl + "/" + model.url;
        this.httpCall.get(url, model.options)
          .toPromise()
          .then((success) => {
            this.handleSuccessResopne(success, model)
              .then((res) => { resolve(res); })
              .catch((rej) => { reject(rej); });
          })
          .catch((error) => { return this.handleError(error, model); });

      }).catch(() => { reject(); })
    })
  }

  private postRequest(model: ApiCallModel) {
    return new Promise((resolve, reject) => {
      if (!model.options) {
        model.options = this.apiOptions.getOptions();
      }
      // if (model.progressBar != null) {
      //   model.progressBar.value = 0;
      // }
      this.CanCallApi(model.url).then(() => {
        if (model.showLoading) {
          this.loadingService.show();
        }
        let url = model.baseUrl + "/" + model.url;

        const req = new HttpRequest('POST', url, model.data, model.options);
        this.httpCall.request(req).subscribe(

          (event: HttpEvent<any>) => {
            switch (event.type) {

              case HttpEventType.Sent:
                break;
              case HttpEventType.ResponseHeader:
                break;
              case HttpEventType.UploadProgress:
                // if (model.progressBar != null) {
                //   model.progressBar.value = Math.round(100 * event.loaded / event.total);
                // }
                break;
              case HttpEventType.DownloadProgress:
                // if (model.progressBar != null) {
                //   model.progressBar.value = Math.round(event.loaded / 1024);
                // }
                break;
              case HttpEventType.Response:

                // if (model.progressBar != null) {
                //   model.progressBar.value = 0;
                // }
                this.handleSuccessResopne(event.body, model)
                  .then((res) => { resolve(res); })
                  .catch((rej) => { reject(rej); });


            }
          },
          (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              return this.handleError(err, model);

            } else {

              return this.handleError(err, model);
              this.router.navigate(['/error', err.error.error]);

            }
          }

        );

        // this.httpCall.post(url, model.data, model.options)
        //   .toPromise()

        //   .then((success) => {
        //     
        //     this.handleSuccessResopne(success, model)
        //       .then((res) => { resolve(res); })
        //       .catch((rej) => { reject(rej); });
        //   })
        //   .catch((error) => { return this.handleError(error, model); });
      }).catch(() => { reject(); })
    })
  }

  // private putRequest(model: ApiCallModel) {
  //   return new Promise((resolve, reject) => {
  //     if (!model.options) {
  //       model.options = this.apiOptions.getOptions();
  //     }
  //     this.CanCallApi(model.url).then(() => {
  //       if (model.showLoading) {
  //         this.loadingService.show();
  //       }
  //       let url = model.baseUrl + "/" + model.url;
  //       this.httpCall.put(url, model.data, model.options)
  //         .toPromise()

  //         .then((success) => {
  //           this.handleSuccessResopne(success, model)
  //             .then((res) => { resolve(res); })
  //             .catch((rej) => { reject(rej); });
  //         })
  //         .catch((error) => { return this.handleError(error, model); });
  //     }).catch(() => { reject(); })
  //   })
  // }

  // private deleteRequest(model: ApiCallModel) {
  //   return new Promise((resolve, reject) => {
  //     if (!model.options) {
  //       model.options = this.apiOptions.getOptions();
  //     }
  //     this.CanCallApi(model.url).then(() => {
  //       if (model.showLoading) {
  //         this.loadingService.show();
  //       }
  //       let url = model.baseUrl + "/" + model.url;
  //       this.httpCall.delete(url, model.options)
  //         .toPromise()

  //         .then((success) => {
  //           this.handleSuccessResopne(success, model)
  //             .then((res) => { resolve(res); })
  //             .catch((rej) => { reject(rej); });
  //         })
  //         .catch((error) => { return this.handleError(error, model); });
  //     }).catch(() => { reject(); })
  //   })
  // }

  // private getUserData() {
  //   return new Promise((resolve, reject) => {
  //     var model = new ApiCallModel();
  //     model.url = 'AccessRight/GetCurrentUserData';
  //     if (!model.options) {
  //       model.options = this.apiOptions.getOptions();
  //     }
  //     if (model.showLoading) {
  //       this.loadingService.show();
  //     }
  //     let url = model.baseUrl + "/" + model.url;
  //     this.httpCall.get(url, model.options)
  //       .toPromise()

  //       .then((success) => {
  //         this.handleSuccessResopne(success, model)
  //           .then((res) => { resolve(res); })
  //           .catch((rej) => { reject(rej); });
  //       })
  //       .catch((error) => { return this.handleError(error, model); });

  //   })
  // }





}