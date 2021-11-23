// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-buffer-geometry',
  exportAs: 'ngtBufferGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtBufferGeometry,
    }
  ],
})
export class NgtBufferGeometry extends NgtGeometry<THREE.BufferGeometry> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.BufferGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.BufferGeometry>) {
    this.extraArgs = v;
  }

  geometryType = THREE.BufferGeometry;
}

@NgModule({
  declarations: [NgtBufferGeometry],
  exports: [NgtBufferGeometry],
})
export class NgtBufferGeometryModule {}

