import {
  NgtAnyConstructor,
  NgtMaterialGeometry,
  provideMaterialGeometryRef,
  provideNgtMaterialGeometry,
} from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-points',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtMaterialGeometry(NgtPoints), provideMaterialGeometryRef(NgtPoints)],
})
export class NgtPoints extends NgtMaterialGeometry<THREE.Points> {
  override get objectType(): NgtAnyConstructor<THREE.Points> {
    return THREE.Points;
  }
}
