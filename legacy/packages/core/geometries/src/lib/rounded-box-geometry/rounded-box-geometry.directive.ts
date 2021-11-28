// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import { RoundedBoxGeometry  } from 'three/examples/jsm/geometries/RoundedBoxGeometry';

@Directive({
  selector: 'ngt-rounded-box-geometry',
  exportAs: 'ngtRoundedBoxGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtRoundedBoxGeometry,
    }
  ],
})
export class NgtRoundedBoxGeometry extends NgtGeometry<RoundedBoxGeometry> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof RoundedBoxGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof RoundedBoxGeometry>) {
    this.extraArgs = v;
  }

  geometryType = RoundedBoxGeometry;
}

@NgModule({
  declarations: [NgtRoundedBoxGeometry],
  exports: [NgtRoundedBoxGeometry],
})
export class NgtRoundedBoxGeometryModule {}

