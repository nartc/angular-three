import { Directive, Input } from '@angular/core';
import { BufferAttribute } from 'three';
import { ThreeAttribute } from '../abstracts';

@Directive({
  selector: 'ngt-bufferAttribute',
  exportAs: 'ngtBufferAttribute',
  providers: [
    { provide: ThreeAttribute, useExisting: BufferAttributeDirective },
  ],
})
export class BufferAttributeDirective extends ThreeAttribute {
  @Input() set args(v: ConstructorParameters<typeof BufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = BufferAttribute;
}
