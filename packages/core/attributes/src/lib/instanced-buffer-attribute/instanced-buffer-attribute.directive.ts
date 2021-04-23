// GENERATED

import { Directive, Input } from '@angular/core';
import { InstancedBufferAttribute } from 'three';
import { ThreeAttribute } from '../abstracts';

@Directive({
  selector: 'ngt-instancedBufferAttribute',
  exportAs: 'ngtInstancedBufferAttribute',
  providers: [
    {
      provide: ThreeAttribute,
      useExisting: InstancedBufferAttributeDirective,
    },
  ],
})
export class InstancedBufferAttributeDirective extends ThreeAttribute<InstancedBufferAttribute> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof InstancedBufferAttribute>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof InstancedBufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = InstancedBufferAttribute;
}
