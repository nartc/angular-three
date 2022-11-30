// GENERATED - AngularThree v7.0.0
import {
  make,
  NgtInstance,
  NgtObservableInput,
  NgtPrepareInstanceFn,
  NgtVector3,
  provideInstanceRef,
  provideNgtInstance,
  skipFirstUndefined,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-vector3[vector3]',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtInstance(NgtVector3Attribute), provideInstanceRef(NgtVector3Attribute)],
})
export class NgtVector3Attribute extends NgtInstance<THREE.Vector3> {
  @Input() set vector3(vector3: NgtObservableInput<NgtVector3>) {
    this.set({ vector3 });
  }

  override initTrigger$ = this.select((s) => s['vector3'], { debounce: true }).pipe(skipFirstUndefined());

  override initFn(prepareInstance: NgtPrepareInstanceFn<THREE.Vector3>): (() => void) | void | undefined {
    prepareInstance(
      make(
        THREE.Vector3,
        this.getState((s) => s['vector3'])
      )
    );
  }
}
