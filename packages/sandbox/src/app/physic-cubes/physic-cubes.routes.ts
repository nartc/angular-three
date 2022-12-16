import { provideNgtRenderer } from '@angular-three/core';
import { Route } from '@angular/router';

const physicCubesRoutes: Route[] = [
  {
    path: '',
    providers: [provideNgtRenderer()],
    outlet: 'gl',
    loadComponent: () => import('./physic-cubes-scene.component'),
  },
];

export default physicCubesRoutes;
