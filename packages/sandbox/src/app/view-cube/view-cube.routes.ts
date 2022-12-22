import { extend, provideNgtRenderer } from '@angular-three/core-two';
import { Route } from '@angular/router';
import {
  AmbientLight,
  BoxGeometry,
  Mesh,
  MeshLambertMaterial,
  MeshNormalMaterial,
  PointLight,
  TorusGeometry,
} from 'three';

extend({
  Mesh,
  TorusGeometry,
  MeshNormalMaterial,
  MeshLambertMaterial,
  BoxGeometry,
  AmbientLight,
  PointLight,
});

const routes: Route[] = [
  {
    path: '',
    providers: [provideNgtRenderer()],
    outlet: 'gl',
    loadComponent: () => import('./view-cube-scene.component'),
  },
];

export default routes;
