import { extend, provideNgtRenderer } from '@angular-three/core';
import { Route } from '@angular/router';
import { BoxGeometry, Color, Group, Mesh, MeshBasicMaterial, MeshNormalMaterial } from 'three';
import { OrbitControls } from 'three-stdlib';

extend({ Group, Mesh, BoxGeometry, MeshBasicMaterial, MeshNormalMaterial, OrbitControls, Color });

const cubesRoutes: Route[] = [
  {
    path: '',
    providers: [provideNgtRenderer()],
    outlet: 'gl',
    loadComponent: () => import('./cubes-scene.component'),
  },
];

export default cubesRoutes;
