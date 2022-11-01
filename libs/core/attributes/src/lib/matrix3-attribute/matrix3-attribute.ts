import * as THREE from 'three';
import {
  make,
  NgtInstance,
  NgtInstanceNode,
  provideInstanceRef,
  provideNgtInstance,
  NgtMatrix3
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ngt-matrix3[matrix3]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
      provideNgtInstance(NgtMatrix3Attribute),
      provideInstanceRef(NgtMatrix3Attribute)
  ],
})
export class NgtMatrix3Attribute extends NgtInstance<THREE.Matrix3> {
  @Input() set matrix3(matrix3: NgtMatrix3) {
    this.set({ matrix3 })
  }

  override initTrigger$ = this.select((s) => s['matrix3']);

  protected override initFn(
    prepareInstance: (instance: THREE.Matrix3, uuid?: string) => NgtInstanceNode
  ): (() => void) | void | undefined {
    prepareInstance(
      make(
        THREE.Matrix3,
        this.get((s) => s['matrix3'])
      )
    );
  }
}
