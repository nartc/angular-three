// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-ring-geometry',
  exportAs: 'ngtRingGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtRingGeometry,
    }
  ],
})
export class NgtRingGeometry extends NgtGeometry<THREE.RingGeometry> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.RingGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.RingGeometry>) {
    this.extraArgs = v;
  }

  geometryType = THREE.RingGeometry;
}

@NgModule({
  declarations: [NgtRingGeometry],
  exports: [NgtRingGeometry],
})
export class NgtRingGeometryModule {}

