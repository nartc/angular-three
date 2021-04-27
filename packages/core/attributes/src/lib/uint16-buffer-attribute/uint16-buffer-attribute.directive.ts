// GENERATED
import { ThreeAttribute } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Uint16BufferAttribute } from 'three';

@Directive({
  selector: 'ngt-uint16-buffer-attribute',
  exportAs: 'ngtUint16BufferAttribute',
  providers: [
    {
      provide: ThreeAttribute,
      useExisting: Uint16BufferAttributeDirective,
    },
  ],
})
export class Uint16BufferAttributeDirective extends ThreeAttribute<Uint16BufferAttribute> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof Uint16BufferAttribute>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof Uint16BufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = Uint16BufferAttribute;
}
