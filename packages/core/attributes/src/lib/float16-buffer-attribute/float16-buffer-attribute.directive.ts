// GENERATED
import { ThreeAttribute } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Float16BufferAttribute } from 'three';

@Directive({
  selector: 'ngt-float16BufferAttribute',
  exportAs: 'ngtFloat16BufferAttribute',
  providers: [
    {
      provide: ThreeAttribute,
      useExisting: Float16BufferAttributeDirective,
    },
  ],
})
export class Float16BufferAttributeDirective extends ThreeAttribute<Float16BufferAttribute> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof Float16BufferAttribute>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof Float16BufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = Float16BufferAttribute;
}
