import * as THREE from 'three';
import {
  make,
  NgtInstance,
  NgtPrepareInstanceFn,
  provideInstanceRef,
  provideNgtInstance,
  NgtVector4,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ngt-vector4[vector4]',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtInstance(NgtVector4Attribute),
    provideInstanceRef(NgtVector4Attribute),
  ],
})
export class NgtVector4Attribute extends NgtInstance<THREE.Vector4> {
  @Input() set vector4(vector4: NgtVector4) {
    this.set({ vector4 });
  }

  override initTrigger$ = this.select((s) => s['vector4']);

  override initFn(
    prepareInstance: NgtPrepareInstanceFn<THREE.Vector4>
  ): (() => void) | void | undefined {
    prepareInstance(
      make(
        THREE.Vector4,
        this.get((s) => s['vector4'])
      )
    );
  }
}
