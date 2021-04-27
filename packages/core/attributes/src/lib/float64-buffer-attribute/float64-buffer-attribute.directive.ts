// GENERATED
import { ThreeAttribute } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Float64BufferAttribute } from 'three';

@Directive({
  selector: 'ngt-float64-buffer-attribute',
  exportAs: 'ngtFloat64BufferAttribute',
  providers: [
    {
      provide: ThreeAttribute,
      useExisting: Float64BufferAttributeDirective,
    },
  ],
})
export class Float64BufferAttributeDirective extends ThreeAttribute<Float64BufferAttribute> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof Float64BufferAttribute>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof Float64BufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = Float64BufferAttribute;
}
