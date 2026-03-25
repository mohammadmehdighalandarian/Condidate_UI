import { InjectionToken, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ShareModule } from './modules/share.module';
import { FooterModule } from './components/common/footer/footer.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { getPersianPaginatorIntl } from './shared/persian-paginator-intl';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MainLayoutModule } from './components/common/main-layout/main-layout.module';
import { authGuard } from './guards/authGuard';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';

@NgModule({
  declarations: [
    AppComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    
    FormsModule,
    ReactiveFormsModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.none
    }),
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    HttpClientModule,
    MatIconModule,

    MainLayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    ShareModule,
    FooterModule,

  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    { provide: MatPaginatorIntl, useValue: getPersianPaginatorIntl() },
    JwtHelperService,
    authGuard

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
