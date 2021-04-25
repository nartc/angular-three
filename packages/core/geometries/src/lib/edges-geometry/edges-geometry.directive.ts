// GENERATED
import { ThreeBufferGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { EdgesGeometry } from 'three';

@Directive({
  selector: 'ngt-edgesGeometry',
  exportAs: 'ngtEdgesGeometry',
  providers: [
    {
      provide: ThreeBufferGeometry,
      useExisting: EdgesGeometryDirective,
    },
  ],
})
export class EdgesGeometryDirective extends ThreeBufferGeometry<EdgesGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof EdgesGeometry>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof EdgesGeometry>) {
    this.extraArgs = v;
  }

  geometryType = EdgesGeometry;
}
