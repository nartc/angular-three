// GENERATED
import { NgtAttribute } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-int8-buffer-attribute',
  exportAs: 'ngtInt8BufferAttribute',
  providers: [
    {
      provide: NgtAttribute,
      useExisting: NgtInt8BufferAttribute,
    }
  ],
})
export class NgtInt8BufferAttribute extends NgtAttribute<THREE.Int8BufferAttribute> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Int8BufferAttribute> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.Int8BufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = THREE.Int8BufferAttribute;
}

@NgModule({
  declarations: [NgtInt8BufferAttribute],
  exports: [NgtInt8BufferAttribute],
})
export class NgtInt8BufferAttributeModule {}

