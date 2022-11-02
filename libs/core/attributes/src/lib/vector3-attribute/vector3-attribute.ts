import * as THREE from 'three';
import {
  make,
  NgtInstance,
  NgtPrepareInstanceFn,
  provideInstanceRef,
  provideNgtInstance,
  NgtVector3,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ngt-vector3[vector3]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtInstance(NgtVector3Attribute),
    provideInstanceRef(NgtVector3Attribute),
  ],
})
export class NgtVector3Attribute extends NgtInstance<THREE.Vector3> {
  @Input() set vector3(vector3: NgtVector3) {
    this.set({ vector3 });
  }

  override initTrigger$ = this.select((s) => s['vector3']);

  protected override initFn(
    prepareInstance: NgtPrepareInstanceFn<THREE.Vector3>
  ): (() => void) | void | undefined {
    prepareInstance(
      make(
        THREE.Vector3,
        this.get((s) => s['vector3'])
      )
    );
  }
}
