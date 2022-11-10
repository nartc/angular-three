// GENERATED - AngularThree v7.0.0
import {
  AnyConstructor,
  NgtCommonGeometry,
  provideNgtCommonGeometry,
  provideCommonGeometryRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-box-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtCommonGeometry(NgtBoxGeometry),
    provideCommonGeometryRef(NgtBoxGeometry),
  ],
})
export class NgtBoxGeometry extends NgtCommonGeometry<THREE.BoxGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.BoxGeometry>
    | undefined;

  override get geometryType(): AnyConstructor<THREE.BoxGeometry> {
    return THREE.BoxGeometry;
  }
}
