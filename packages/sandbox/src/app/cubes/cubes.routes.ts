import { extend, provideNgtRenderer } from '@angular-three/core';
import { Route } from '@angular/router';
import * as THREE from 'three';

extend(THREE);

const cubesRoutes: Route[] = [
  {
    path: '',
    providers: [provideNgtRenderer()],
    outlet: 'gl',
    loadComponent: () => import('./cubes-scene.component'),
  },
];

export default cubesRoutes;
