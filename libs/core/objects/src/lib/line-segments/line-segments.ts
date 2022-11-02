import {
  AnyConstructor,
  NgtMaterialGeometry,
  provideMaterialGeometryRef,
  provideNgtMaterialGeometry,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-line-segments',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtMaterialGeometry(NgtLineSegments),
    provideMaterialGeometryRef(NgtLineSegments),
  ],
})
export class NgtLineSegments extends NgtMaterialGeometry<THREE.LineSegments> {
  override get objectType(): AnyConstructor<THREE.LineSegments> {
    return THREE.LineSegments;
  }
}
