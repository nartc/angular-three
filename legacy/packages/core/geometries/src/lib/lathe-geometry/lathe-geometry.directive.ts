// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-lathe-geometry',
  exportAs: 'ngtLatheGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtLatheGeometry,
    }
  ],
})
export class NgtLatheGeometry extends NgtGeometry<THREE.LatheGeometry> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.LatheGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.LatheGeometry>) {
    this.extraArgs = v;
  }

  geometryType = THREE.LatheGeometry;
}

@NgModule({
  declarations: [NgtLatheGeometry],
  exports: [NgtLatheGeometry],
})
export class NgtLatheGeometryModule {}

