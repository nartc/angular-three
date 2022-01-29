// GENERATED
import { NGT_OBJECT_3D_PROVIDER, NgtGeometry } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-box-geometry',
  exportAs: 'ngtBoxGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtBoxGeometry,
    },
    NGT_OBJECT_3D_PROVIDER,
  ],
})
export class NgtBoxGeometry extends NgtGeometry<THREE.BoxGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.BoxGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.BoxGeometry>) {
    this.geometryArgs = v;
  }

  geometryType = THREE.BoxGeometry;
}

@NgModule({
  declarations: [NgtBoxGeometry],
  exports: [NgtBoxGeometry],
})
export class NgtBoxGeometryModule {}
