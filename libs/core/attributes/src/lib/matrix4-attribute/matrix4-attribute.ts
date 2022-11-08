import * as THREE from 'three';
import {
  make,
  NgtInstance,
  NgtPrepareInstanceFn,
  provideInstanceRef,
  provideNgtInstance,
  NgtMatrix4,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ngt-matrix4[matrix4]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtInstance(NgtMatrix4Attribute),
    provideInstanceRef(NgtMatrix4Attribute),
  ],
})
export class NgtMatrix4Attribute extends NgtInstance<THREE.Matrix4> {
  @Input() set matrix4(matrix4: NgtMatrix4) {
    this.set({ matrix4 });
  }

  override initTrigger$ = this.select((s) => s['matrix4']);

  override initFn(
    prepareInstance: NgtPrepareInstanceFn<THREE.Matrix4>
  ): (() => void) | void | undefined {
    prepareInstance(
      make(
        THREE.Matrix4,
        this.get((s) => s['matrix4'])
      )
    );
  }
}
