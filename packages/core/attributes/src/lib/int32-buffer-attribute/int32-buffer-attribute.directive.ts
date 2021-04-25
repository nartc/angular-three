// GENERATED
import { ThreeAttribute } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Int32BufferAttribute } from 'three';

@Directive({
  selector: 'ngt-int32BufferAttribute',
  exportAs: 'ngtInt32BufferAttribute',
  providers: [
    {
      provide: ThreeAttribute,
      useExisting: Int32BufferAttributeDirective,
    },
  ],
})
export class Int32BufferAttributeDirective extends ThreeAttribute<Int32BufferAttribute> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof Int32BufferAttribute>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof Int32BufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = Int32BufferAttribute;
}
