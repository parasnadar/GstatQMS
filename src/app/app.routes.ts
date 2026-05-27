import { Routes } from '@angular/router';

// We use a constant for paths to prevent typos across the app
const PATHS = {
  FILING: 'tokenFiling',
  STATUS: 'tokenStatus',
};

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: PATHS.FILING },

  {
    path: PATHS.FILING,
    loadComponent: () =>
      import('./landing/landing.component').then((c) => c.LandingComponent),
  },
  {
    path: PATHS.STATUS,
    loadComponent: () =>
      import('./token-status/token-status.component').then(
        (c) => c.TokenStatusComponent,
      ),
  },

  { path: '**', redirectTo: PATHS.FILING },
];
