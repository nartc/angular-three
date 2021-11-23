// GENERATED
import { NgtAttribute } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-int32-buffer-attribute',
  exportAs: 'ngtInt32BufferAttribute',
  providers: [
    {
      provide: NgtAttribute,
      useExisting: NgtInt32BufferAttribute,
    }
  ],
})
export class NgtInt32BufferAttribute extends NgtAttribute<THREE.Int32BufferAttribute> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Int32BufferAttribute> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.Int32BufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = THREE.Int32BufferAttribute;
}

@NgModule({
  declarations: [NgtInt32BufferAttribute],
  exports: [NgtInt32BufferAttribute],
})
export class NgtInt32BufferAttributeModule {}

