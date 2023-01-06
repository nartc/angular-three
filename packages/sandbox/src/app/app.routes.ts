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
    path: 'kinematic-cube',
    loadComponent: () => import('./kinematic-cube/kinematic-cube.component'),
  },
  {
    path: 'height-field',
    loadComponent: () => import('./height-field/height-field.component'),
  },
  {
    path: 'movement-regression',
    loadComponent: () => import('./movement-regression/movement-regression.component'),
  },
  {
    path: 'object-clump',
    loadComponent: () => import('./object-clump/object-clump.component'),
  },
  {
    path: 'keen-bloom',
    loadComponent: () => import('./keen-bloom/keen-bloom.component'),
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
