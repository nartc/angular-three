import {
  NgtAnyConstructor,
  NgtMaterialGeometry,
  provideMaterialGeometryRef,
  provideNgtMaterialGeometry,
} from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-line-loop',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtMaterialGeometry(NgtLineLoop), provideMaterialGeometryRef(NgtLineLoop)],
})
export class NgtLineLoop extends NgtMaterialGeometry<THREE.LineLoop> {
  override get objectType(): NgtAnyConstructor<THREE.LineLoop> {
    return THREE.LineLoop;
  }
}
