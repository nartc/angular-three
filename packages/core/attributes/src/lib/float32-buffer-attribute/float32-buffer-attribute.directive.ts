// GENERATED
import { ThreeAttribute } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Float32BufferAttribute } from 'three';

@Directive({
  selector: 'ngt-float32BufferAttribute',
  exportAs: 'ngtFloat32BufferAttribute',
  providers: [
    {
      provide: ThreeAttribute,
      useExisting: Float32BufferAttributeDirective,
    },
  ],
})
export class Float32BufferAttributeDirective extends ThreeAttribute<Float32BufferAttribute> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof Float32BufferAttribute>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof Float32BufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = Float32BufferAttribute;
}
