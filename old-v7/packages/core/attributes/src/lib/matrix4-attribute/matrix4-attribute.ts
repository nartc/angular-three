// GENERATED - AngularThree v7.0.0
import * as THREE from 'three';
import {
  make,
  NgtInstance,
  NgtPrepareInstanceFn,
  provideInstanceRef,
  provideNgtInstance,
  NgtObservableInput,
  skipFirstUndefined,
  NgtMatrix4,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngt-matrix4[matrix4]',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtInstance(NgtMatrix4Attribute), provideInstanceRef(NgtMatrix4Attribute)],
})
export class NgtMatrix4Attribute extends NgtInstance<THREE.Matrix4> {
  @Input() set matrix4(matrix4: NgtObservableInput<NgtMatrix4>) {
    this.set({ matrix4 });
  }

  override initTrigger$ = this.select((s) => s['matrix4'], { debounce: true }).pipe(skipFirstUndefined());

  override initFn(prepareInstance: NgtPrepareInstanceFn<THREE.Matrix4>): (() => void) | void | undefined {
    prepareInstance(
      make(
        THREE.Matrix4,
        this.getState((s) => s['matrix4'])
      )
    );
  }
}
