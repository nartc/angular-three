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
  },
  {
    path: 'physic-cubes',
    loadComponent: () => import('./physic-cubes/physic-cubes.component'),
    loadChildren: () => import('./physic-cubes/physic-cubes.routes'),
  },
  {
    path: 'view-cube',
    loadComponent: () => import('./view-cube/view-cube.component'),
    loadChildren: () => import('./view-cube/view-cube.routes'),
  },
];
