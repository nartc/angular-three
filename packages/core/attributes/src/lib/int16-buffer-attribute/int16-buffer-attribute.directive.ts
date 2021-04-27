// GENERATED
import { ThreeAttribute } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Int16BufferAttribute } from 'three';

@Directive({
  selector: 'ngt-int16-buffer-attribute',
  exportAs: 'ngtInt16BufferAttribute',
  providers: [
    {
      provide: ThreeAttribute,
      useExisting: Int16BufferAttributeDirective,
    },
  ],
})
export class Int16BufferAttributeDirective extends ThreeAttribute<Int16BufferAttribute> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof Int16BufferAttribute>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof Int16BufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = Int16BufferAttribute;
}
