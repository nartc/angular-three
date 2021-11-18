import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('@angular-three/docs-content/feature-home').then(
        (m) => m.FeatureHomeModule
      ),
    data: {
      title: 'Home',
    },
  },
  {
    path: 'getting-started',
    loadChildren: () =>
      import('@angular-three/docs-content/feature-getting-started').then(
        (m) => m.FeatureGettingStartedModule
      ),
    data: {
      title: 'Getting Started',
    },
  },
];
