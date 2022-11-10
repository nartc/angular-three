import {
  NgtAnyConstructor,
  NgtMaterialGeometry,
  provideMaterialGeometryRef,
  provideNgtMaterialGeometry,
} from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-line-segments',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtMaterialGeometry(NgtLineSegments), provideMaterialGeometryRef(NgtLineSegments)],
})
export class NgtLineSegments extends NgtMaterialGeometry<THREE.LineSegments> {
  override get objectType(): NgtAnyConstructor<THREE.LineSegments> {
    return THREE.LineSegments;
  }
}
