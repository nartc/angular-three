// GENERATED - AngularThree v7.0.0
import {
  make,
  NgtInstance,
  NgtMatrix3,
  NgtObservableInput,
  NgtPrepareInstanceFn,
  provideInstanceRef,
  provideNgtInstance,
  skipFirstUndefined,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-matrix3[matrix3]',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtInstance(NgtMatrix3Attribute), provideInstanceRef(NgtMatrix3Attribute)],
})
export class NgtMatrix3Attribute extends NgtInstance<THREE.Matrix3> {
  @Input() set matrix3(matrix3: NgtObservableInput<NgtMatrix3>) {
    this.set({ matrix3 });
  }

  override initTrigger$ = this.select((s) => s['matrix3'], { debounce: true }).pipe(skipFirstUndefined());

  override initFn(prepareInstance: NgtPrepareInstanceFn<THREE.Matrix3>): (() => void) | void | undefined {
    prepareInstance(
      make(
        THREE.Matrix3,
        this.getState((s) => s['matrix3'])
      )
    );
  }
}
