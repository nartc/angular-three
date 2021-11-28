// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-wireframe-geometry',
  exportAs: 'ngtWireframeGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtWireframeGeometry,
    }
  ],
})
export class NgtWireframeGeometry extends NgtGeometry<THREE.WireframeGeometry> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.WireframeGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.WireframeGeometry>) {
    this.extraArgs = v;
  }

  geometryType = THREE.WireframeGeometry;
}

@NgModule({
  declarations: [NgtWireframeGeometry],
  exports: [NgtWireframeGeometry],
})
export class NgtWireframeGeometryModule {}

