import * as THREE from 'three';
import {
  make,
  NgtInstance,
  NgtInstanceNode,
  provideInstanceRef,
  provideNgtInstance,
  NgtVector4
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ngt-vector4[vector4]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
      provideNgtInstance(NgtVector4Attribute),
      provideInstanceRef(NgtVector4Attribute)
  ],
})
export class NgtVector4Attribute extends NgtInstance<THREE.Vector4> {
  @Input() set vector4(vector4: NgtVector4) {
    this.set({ vector4 })
  }

  override initTrigger$ = this.select((s) => s['vector4']);

  protected override initFn(
    prepareInstance: (instance: THREE.Vector4, uuid?: string) => NgtInstanceNode
  ): (() => void) | void | undefined {
    prepareInstance(
      make(
        THREE.Vector4,
        this.get((s) => s['vector4'])
      )
    );
  }
}
