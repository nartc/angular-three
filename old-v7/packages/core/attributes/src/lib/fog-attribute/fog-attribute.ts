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
  NgtFog,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngt-fog[fog]',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtInstance(NgtFogAttribute), provideInstanceRef(NgtFogAttribute)],
})
export class NgtFogAttribute extends NgtInstance<THREE.Fog> {
  @Input() set fog(fog: NgtObservableInput<NgtFog>) {
    this.set({ fog });
  }

  override initTrigger$ = this.select((s) => s['fog'], { debounce: true }).pipe(skipFirstUndefined());

  override initFn(prepareInstance: NgtPrepareInstanceFn<THREE.Fog>): (() => void) | void | undefined {
    prepareInstance(
      make(
        THREE.Fog,
        this.getState((s) => s['fog'])
      )
    );
  }
}
