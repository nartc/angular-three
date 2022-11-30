// GENERATED - AngularThree v7.0.0
import {
  make,
  NgtInstance,
  NgtObservableInput,
  NgtPrepareInstanceFn,
  NgtVector4,
  provideInstanceRef,
  provideNgtInstance,
  skipFirstUndefined,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-vector4[vector4]',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtInstance(NgtVector4Attribute), provideInstanceRef(NgtVector4Attribute)],
})
export class NgtVector4Attribute extends NgtInstance<THREE.Vector4> {
  @Input() set vector4(vector4: NgtObservableInput<NgtVector4>) {
    this.set({ vector4 });
  }

  override initTrigger$ = this.select((s) => s['vector4'], { debounce: true }).pipe(skipFirstUndefined());

  override initFn(prepareInstance: NgtPrepareInstanceFn<THREE.Vector4>): (() => void) | void | undefined {
    prepareInstance(
      make(
        THREE.Vector4,
        this.getState((s) => s['vector4'])
      )
    );
  }
}
