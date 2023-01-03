import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'test',
    pathMatch: 'full',
  },
  {
    path: 'test',
    loadComponent: () => import('./test/test.component'),
  },
  {
    path: 'cubes',
    loadComponent: () => import('./cubes/cubes.component'),
  },
  {
    path: 'physic-cubes',
    loadComponent: () => import('./physic-cubes/physic-cubes.component'),
  },
  {
    path: 'view-cube',
    loadComponent: () => import('./view-cube/view-cube.component'),
  },
];
