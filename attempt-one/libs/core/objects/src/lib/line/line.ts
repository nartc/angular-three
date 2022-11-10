import {
  AnyConstructor,
  NgtMaterialGeometry,
  provideMaterialGeometryRef,
  provideNgtMaterialGeometry,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-line',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtMaterialGeometry(NgtLine),
    provideMaterialGeometryRef(NgtLine),
  ],
})
export class NgtLine extends NgtMaterialGeometry<THREE.Line> {
  override get objectType(): AnyConstructor<THREE.Line> {
    return THREE.Line;
  }
}
