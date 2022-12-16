import { extend, provideNgtRenderer } from '@angular-three/core';
import { Route } from '@angular/router';
import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
  ShadowMaterial,
  Vector2,
} from 'three';

extend({
  Color,
  Mesh,
  AmbientLight,
  DirectionalLight,
  Vector2,
  PlaneGeometry,
  ShadowMaterial,
  BoxGeometry,
  MeshLambertMaterial,
});

const physicCubesRoutes: Route[] = [
  {
    path: '',
    providers: [provideNgtRenderer()],
    outlet: 'gl',
    loadComponent: () => import('./physic-cubes-scene.component'),
  },
];

export default physicCubesRoutes;
