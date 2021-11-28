// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import { LineGeometry  } from 'three/examples/jsm/lines/LineGeometry';

@Directive({
  selector: 'ngt-line-geometry',
  exportAs: 'ngtLineGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtLineGeometry,
    }
  ],
})
export class NgtLineGeometry extends NgtGeometry<LineGeometry> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof LineGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof LineGeometry>) {
    this.extraArgs = v;
  }

  geometryType = LineGeometry;
}

@NgModule({
  declarations: [NgtLineGeometry],
  exports: [NgtLineGeometry],
})
export class NgtLineGeometryModule {}

