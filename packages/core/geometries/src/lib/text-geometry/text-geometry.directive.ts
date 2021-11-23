// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import { TextGeometry  } from 'three/examples/jsm/geometries/TextGeometry';

@Directive({
  selector: 'ngt-text-geometry',
  exportAs: 'ngtTextGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtTextGeometry,
    }
  ],
})
export class NgtTextGeometry extends NgtGeometry<TextGeometry> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof TextGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof TextGeometry>) {
    this.extraArgs = v;
  }

  geometryType = TextGeometry;
}

@NgModule({
  declarations: [NgtTextGeometry],
  exports: [NgtTextGeometry],
})
export class NgtTextGeometryModule {}

