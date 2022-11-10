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
  selector: 'ngt-tube-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtCommonGeometry(NgtTubeGeometry),
    provideCommonGeometryRef(NgtTubeGeometry),
  ],
})
export class NgtTubeGeometry extends NgtCommonGeometry<THREE.TubeGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.TubeGeometry>
    | undefined;

  override get geometryType(): AnyConstructor<THREE.TubeGeometry> {
    return THREE.TubeGeometry;
  }
}
