// GENERATED
import { NGT_OBJECT_PROVIDER, NgtGeometry } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-lathe-geometry',
  exportAs: 'ngtLatheGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtLatheGeometry,
    },
    NGT_OBJECT_PROVIDER,
  ],
})
export class NgtLatheGeometry extends NgtGeometry<THREE.LatheGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.LatheGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.LatheGeometry>) {
    this.geometryArgs = v;
  }

  geometryType = THREE.LatheGeometry;
}

@NgModule({
  declarations: [NgtLatheGeometry],
  exports: [NgtLatheGeometry],
})
export class NgtLatheGeometryModule {}
