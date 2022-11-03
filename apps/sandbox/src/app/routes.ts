import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
  },
  {
    path: 'cubes',
    loadComponent: () => import('./cubes/cubes.component'),
    data: {
      title: 'Simple Cubes',
      description:
        'Two spinning cubes along with a cube with different materials',
      link: '/cubes',
      asset: 'assets/examples/cubes',
      source:
        'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/cubes',
    },
  },
  {
    path: 'view-cube',
    loadComponent: () => import('./view-cube/view-cube.component'),
    data: {
      title: 'View Cube',
      description: 'Heads-up-displays using NgtPortal',
      link: '/view-cube',
      asset: 'assets/examples/cubes',
      source:
        'https://github.com/nartc/angular-three/tree/main/apps/sandbox/src/app/view-cube',
    },
  },
];
