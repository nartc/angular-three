// GENERATED - AngularThree v7.0.0
import {
  make,
  NgtColor,
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
  selector: 'ngt-color[color]',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtInstance(NgtColorAttribute), provideInstanceRef(NgtColorAttribute)],
})
export class NgtColorAttribute extends NgtInstance<THREE.Color> {
  @Input() set color(color: NgtObservableInput<NgtColor>) {
    this.set({ color });
  }

  override initTrigger$ = this.select((s) => s['color'], { debounce: true }).pipe(skipFirstUndefined());

  override initFn(prepareInstance: NgtPrepareInstanceFn<THREE.Color>): (() => void) | void | undefined {
    prepareInstance(
      make(
        THREE.Color,
        this.getState((s) => s['color'])
      )
    );
  }
}
