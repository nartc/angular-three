// GENERATED
import { ThreeAttribute } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Uint8BufferAttribute } from 'three';

@Directive({
  selector: 'ngt-uint8-buffer-attribute',
  exportAs: 'ngtUint8BufferAttribute',
  providers: [
    {
      provide: ThreeAttribute,
      useExisting: Uint8BufferAttributeDirective,
    },
  ],
})
export class Uint8BufferAttributeDirective extends ThreeAttribute<Uint8BufferAttribute> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof Uint8BufferAttribute>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof Uint8BufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = Uint8BufferAttribute;
}
