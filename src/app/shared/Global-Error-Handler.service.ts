import { ErrorHandler, Inject, Injectable, Injector, NgZone } from '@angular/core';
import { MessageService } from './message.service';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(
    private zone: NgZone, @Inject(Injector) private readonly injector: Injector) {
  }
  private get messageService() {
    return this.injector.get(MessageService);
  }
  handleError(err: any) {
    if (/Connection Error/.test(err.message) || /StarterCountError/.test(err.message)) {
      this.zone.run(() => {
        this.messageService.showErrorToast(err.message, '',
          {
            tapToDismiss: true,
            positionClass: 'toast-bottom-full-width',
            preventDuplicates: true,
            progressBar: true,
            progressAnimation: 'increasing',
            closeButton: true
          });
      });
    } else {
      console.error(err);
    }
  }
}
