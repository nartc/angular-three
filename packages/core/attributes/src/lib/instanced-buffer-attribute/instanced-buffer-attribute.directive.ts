// GENERATED
import { ThreeAttribute } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { InstancedBufferAttribute } from 'three';

@Directive({
  selector: 'ngt-instanced-buffer-attribute',
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
