import { Directive, Input } from '@angular/core';
import { InstancedBufferAttribute } from 'three';
import { ThreeAttribute } from '../abstracts';

@Directive({
  selector: 'ngt-instancedBufferAttribute',
  exportAs: 'ngtInstancedBufferAttribute',
  providers: [
    { provide: ThreeAttribute, useExisting: InstancedBufferAttributeDirective },
  ],
})
export class InstancedBufferAttributeDirective extends ThreeAttribute<InstancedBufferAttribute> {
  @Input() set args(v: ConstructorParameters<typeof InstancedBufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = InstancedBufferAttribute;
}
