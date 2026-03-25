import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription, fromEvent } from 'rxjs';
import {
  ApiDataResponse,
  ApiResponse,
} from 'src/app/models/base/apiDataRseponseModel';
import { Biography } from 'src/app/models/biographyModel';
import { BiographyService } from 'src/app/services/biography.service';
import { MessageService } from 'src/app/shared/message.service';
declare var $: any;

@Component({
  selector: 'app-biography',
  templateUrl: './biography.component.html',
  styleUrls: ['./biography.component.css'],
})
export class BiographyComponent implements OnInit, AfterViewInit {
  safeBiography: any;
  biography: Biography = new Biography();
  candidateId = '';
  biographyValueCount;
  maxStyle: string;
  private maxChanged: Subscription | undefined;
  constructor(
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private biographyService: BiographyService
  ) { }

  ngOnInit() {
    this.getProfile();
  }

  ngAfterViewInit() {
    this.initializeSummernote();
    if (!this.maxChanged) {
      this.maxChanged = fromEvent(window, 'biographyValueChanged').subscribe(event => {
        this.biographyValueCount = $('#maxContentPost').html().split('/')[0];
        if (this.biographyValueCount > 4000) {
          this.maxStyle = 'color:red !important';
        }else{
          this.maxStyle = 'color:black !important';

        }
      })
    }
  }

  getProfile() {
    this.biographyService
      .getProfile()
      .then((response: ApiDataResponse<Biography>) => {
        if (response.isSuccess && response.data) {
          this.biography = response.data;
          this.safeBiography = this.sanitizer.bypassSecurityTrustHtml(
            this.biography.remark
          );
          $('#summernote').summernote('code', this.biography.remark);

        }
      }).catch((error) => { });

  }

  submitBiography(): void {
    if ($('.note-editable').text().length > 4000) {
      this.messageService.showErrorSweetAlert('تعداد کاراکترهای وارد شده بیشتر از حد مجاز می‌باشد.', 'توجه!');
      return;
    }


    this.biography.remark = $('#summernote').summernote('code');
    this.biography.plainRemark = $('.note-editable').text();
    this.safeBiography = this.sanitizer.bypassSecurityTrustHtml(this.biography.remark);
    this.biographyService
      .saveProfile(this.biography)
      .then((response: ApiResponse) => {

      })
      .catch((error) => {

      });

  }

  cancelEditing(): void {
    $('#summernote').summernote('reset');
    $('#maxContentPost').text($('.note-editable').text().length + '/' + 4000);

  }

  initializeSummernote(): void {
    $('#summernote')
      .summernote({
        lang: 'fa-IR',
        height: 250,
        minHeight: 250,
        maxHeight: null,
        toolbar: [
          ['view', ['fullscreen', 'redo', 'undo']],
          ['insert', ['hr']],
          ['table', ['table']],
          ['height', ['height']],
          ['font', [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'clear',
            'color',
            'forecolor',
            'backcolor',
            'fontsize',]],
          ['para', ['ul', 'ol', 'paragraph']],

        ], popover: {
          image: [],
          link: [],
          air: []
        }
        , callbacks: {
          onKeydown: function (e) {
            var t = e.currentTarget.innerText;
            if (t.length >= 4000) {
              if (e.keyCode != 8)
                e.preventDefault();
            }
          },
          onKeyup: function (e) {
            var t = e.currentTarget.innerText;
            $('#maxContentPost').text(t.length + '/' + 4000);
            window.dispatchEvent(new Event('biographyValueChanged'));

          },
          onPaste: function (e) {
            // debugger;
            // var t = e.currentTarget.innerText;

            // var bufferText = ((e.originalEvent || e).clipboardData || navigator.clipboard.readText()).getData('Text');
            // e.preventDefault();
            // var all = t + bufferText;
            // document.execCommand('insertText', false, all.substring(0, 4000));
            // $('#maxContentPost').text(all.length + '/' + 4000);
            // setTimeout(() => {
            //   var t = e.currentTarget.innerText;
            //   if (t.length >= 100) {
            //     $('#summernote').summernote('code',$('#summernote').summernote('code').substring(0,100));
            //   }
            //   // $('#maxContentPost').text($('.note-editable').text().length + '/' + 4000);

            // }, 300);
            setTimeout(() => {

              window.dispatchEvent(new Event('biographyValueChanged'));

            }, 400);
          },
          onChange: () => {
            this.biographyToSafeHtml();
          },
        }
      });
    setTimeout(function () {
      $('#maxContentPost').text($('.note-editable').text().length + '/' + 4000);
      window.dispatchEvent(new Event('biographyValueChanged'));

    }, 400);




    // .summernote({
    //     callbacks: {
    //       onChange: () => {
    //         this.biographyToSafeHtml();
    //       },
    //     },
    //   });
  }

  biographyToSafeHtml(): void {
    this.safeBiography = this.sanitizer.bypassSecurityTrustHtml(
      this.biography.remark || ''
    );
  }


}
