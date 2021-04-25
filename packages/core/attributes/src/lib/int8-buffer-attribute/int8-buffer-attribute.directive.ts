// GENERATED
import { ThreeAttribute } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Int8BufferAttribute } from 'three';

@Directive({
  selector: 'ngt-int8BufferAttribute',
  exportAs: 'ngtInt8BufferAttribute',
  providers: [
    {
      provide: ThreeAttribute,
      useExisting: Int8BufferAttributeDirective,
    },
  ],
})
export class Int8BufferAttributeDirective extends ThreeAttribute<Int8BufferAttribute> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof Int8BufferAttribute>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof Int8BufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = Int8BufferAttribute;
}
