// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import { WireframeGeometry2  } from 'three/examples/jsm/lines/WireframeGeometry2';

@Directive({
  selector: 'ngt-wireframe-geometry2',
  exportAs: 'ngtWireframeGeometry2',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtWireframeGeometry2,
    }
  ],
})
export class NgtWireframeGeometry2 extends NgtGeometry<WireframeGeometry2> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof WireframeGeometry2> | undefined;

  @Input() set args(v: ConstructorParameters<typeof WireframeGeometry2>) {
    this.extraArgs = v;
  }

  geometryType = WireframeGeometry2;
}

@NgModule({
  declarations: [NgtWireframeGeometry2],
  exports: [NgtWireframeGeometry2],
})
export class NgtWireframeGeometry2Module {}

