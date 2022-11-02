import {
  AnyConstructor,
  NgtMaterialGeometry,
  provideMaterialGeometryRef,
  provideNgtMaterialGeometry,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-line-loop',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtMaterialGeometry(NgtLineLoop),
    provideMaterialGeometryRef(NgtLineLoop),
  ],
})
export class NgtLineLoop extends NgtMaterialGeometry<THREE.LineLoop> {
  override get objectType(): AnyConstructor<THREE.LineLoop> {
    return THREE.LineLoop;
  }
}
