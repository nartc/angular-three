// GENERATED
import { ThreeAttribute } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Uint32BufferAttribute } from 'three';

@Directive({
  selector: 'ngt-uint32-buffer-attribute',
  exportAs: 'ngtUint32BufferAttribute',
  providers: [
    {
      provide: ThreeAttribute,
      useExisting: Uint32BufferAttributeDirective,
    },
  ],
})
export class Uint32BufferAttributeDirective extends ThreeAttribute<Uint32BufferAttribute> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof Uint32BufferAttribute>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof Uint32BufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = Uint32BufferAttribute;
}
