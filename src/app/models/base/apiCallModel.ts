import { MatProgressBar } from "@angular/material/progress-bar";
import { AngularAlertType } from "src/app/enums/enums";
import { environment } from "src/app/enviroments/environment.prod";

export class ApiCallModel {
    url: string;
    data: any;
    options: any;
    apiVersion: number = 1;
    baseUrl: string = /*window.location.origin + */environment.baseUrl + environment.apiVersion;

    showSuccessAlert: boolean = false;
    successAlertType: AngularAlertType = AngularAlertType.Swal;
    // successAlertText: string = 'عملیات با موفقیت انجام شد.';

    showErrorAlert: boolean = true;
    errorAlertType: AngularAlertType = AngularAlertType.Swal;
    // errorAlertText: string = 'خطا درانجام عملیات.';

    showNoDataAlert: boolean = false;
    // noDataAlertText: string = 'اطلاعاتی یافت نشد';

    showLoading: boolean = true;

    showConfirmAlert: boolean = false;
    confirmAlertText: string;
    confirmTitleText: string = "هشدار";

    redirectToPageWhenForbidden: boolean = false;
    forbiddenUrl: string;

    resolveAfterMessage = false;
    progressBar: MatProgressBar;


}