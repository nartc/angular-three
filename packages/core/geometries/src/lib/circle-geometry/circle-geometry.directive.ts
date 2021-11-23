// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-circle-geometry',
  exportAs: 'ngtCircleGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtCircleGeometry,
    }
  ],
})
export class NgtCircleGeometry extends NgtGeometry<THREE.CircleGeometry> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.CircleGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.CircleGeometry>) {
    this.extraArgs = v;
  }

  geometryType = THREE.CircleGeometry;
}

@NgModule({
  declarations: [NgtCircleGeometry],
  exports: [NgtCircleGeometry],
})
export class NgtCircleGeometryModule {}

