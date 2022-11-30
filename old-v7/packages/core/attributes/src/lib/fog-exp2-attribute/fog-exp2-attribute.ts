// GENERATED - AngularThree v7.0.0
import {
  make,
  NgtFogExp2,
  NgtInstance,
  NgtObservableInput,
  NgtPrepareInstanceFn,
  provideInstanceRef,
  provideNgtInstance,
  skipFirstUndefined,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-fog-exp2[fogExp2]',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtInstance(NgtFogExp2Attribute), provideInstanceRef(NgtFogExp2Attribute)],
})
export class NgtFogExp2Attribute extends NgtInstance<THREE.FogExp2> {
  @Input() set fogExp2(fogExp2: NgtObservableInput<NgtFogExp2>) {
    this.set({ fogExp2 });
  }

  override initTrigger$ = this.select((s) => s['fogExp2'], { debounce: true }).pipe(skipFirstUndefined());

  override initFn(prepareInstance: NgtPrepareInstanceFn<THREE.FogExp2>): (() => void) | void | undefined {
    prepareInstance(
      make(
        THREE.FogExp2,
        this.getState((s) => s['fogExp2'])
      )
    );
  }
}
