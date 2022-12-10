import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'cubes',
    pathMatch: 'full',
  },
  {
    path: 'cubes',
    loadComponent: () => import('./cubes/cubes.component'),
    loadChildren: () => import('./cubes/cubes.routes'),
  },
];
