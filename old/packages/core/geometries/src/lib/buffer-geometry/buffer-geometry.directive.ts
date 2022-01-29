// GENERATED
import { NGT_OBJECT_3D_PROVIDER, NgtGeometry } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-buffer-geometry',
  exportAs: 'ngtBufferGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtBufferGeometry,
    },
    NGT_OBJECT_3D_PROVIDER,
  ],
})
export class NgtBufferGeometry extends NgtGeometry<THREE.BufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.BufferGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.BufferGeometry>) {
    this.geometryArgs = v;
  }

  geometryType = THREE.BufferGeometry;
}

@NgModule({
  declarations: [NgtBufferGeometry],
  exports: [NgtBufferGeometry],
})
export class NgtBufferGeometryModule {}
