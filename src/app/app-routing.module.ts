import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './components/common/main-layout/main-layout.Component';
import { authGuard } from './guards/authGuard';

const routes: Routes = [
  {
    path: 'landing',
    loadChildren: () =>
      import('./components/landing-page/landing-page.module').then(
        (m) => m.LandingPageModule,
      ),
  },
  // {
  //   path: '',
  //   loadChildren: () =>
  //     import('./components/landing-page/landing-page.module').then(
  //       (m) => m.LandingPageModule
  //     ),
  // },
  {
    path: '',
    redirectTo: 'mainPage',
    pathMatch: 'full',
  },

  {
    canActivate: [authGuard],
    path: 'AcceptLaws',
    loadChildren: () =>
      import('./components/accept-laws/accept-laws.module').then(
        (m) => m.AcceptLawsModule,
      ),
  },
  {
    path: '',
    canActivate: [authGuard],
    component: MainLayoutComponent,
    children: [
      {
        path: 'WebPortal',
        loadChildren: () =>
          import('./components/web-portals/web-portals.module').then(
            (m) => m.WebPortalsModule,
          ),
      },
      {
        path: 'biography',
        loadChildren: () =>
          import('./components/biography/biography.module').then(
            (m) => m.BiographyModule,
          ),
      },
      {
        path: 'mainPage',
        loadChildren: () =>
          import('./components/main-page/main-page.module').then(
            (m) => m.MainPageModule,
          ),
      },
      {
        path: 'SocialNetworks',
        loadChildren: () =>
          import('./components/social-networks/social-networks.module').then(
            (m) => m.SocialNetworksModule,
          ),
      },
      {
        path: 'PartyList',
        loadChildren: () =>
          import('./components/party-list-management/party-list-management.module').then(
            (m) => m.PartyListManagementModule,
          ),
      },
      {
        path: 'CandidateInfo',
        loadChildren: () =>
          import('./components/candidate/candidate-info/candidate-info.module').then(
            (c) => c.CandidateInfoModule,
          ),
      },
      {
        path: 'PoliticalStatus',
        loadChildren: () =>
          import('./components/candidate/political-status/political-status.module').then(
            (m) => m.PoliticalStatusModule,
          ),
      }
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      bindToComponentInputs: true,
    }),
  ],
  exports: [RouterModule],
})
// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
//   providers: [],
// })
export class AppRoutingModule {}
