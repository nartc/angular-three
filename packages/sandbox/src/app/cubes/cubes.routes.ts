import { extend, provideNgtRenderer } from '@angular-three/core-two';
import { Route } from '@angular/router';
import {
  AmbientLight,
  BoxGeometry,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
} from 'three';

extend({
  Group,
  Mesh,
  BoxGeometry,
  MeshBasicMaterial,
  MeshNormalMaterial,
  Color,
  AmbientLight,
});

const cubesRoutes: Route[] = [
  {
    path: '',
    providers: [provideNgtRenderer()],
    outlet: 'gl',
    loadComponent: () => import('./cubes-scene.component'),
  },
];

export default cubesRoutes;
