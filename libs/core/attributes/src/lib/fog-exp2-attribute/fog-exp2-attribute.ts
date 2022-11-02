import * as THREE from 'three';
import {
  make,
  NgtInstance,
  NgtPrepareInstanceFn,
  provideInstanceRef,
  provideNgtInstance,
  NgtFogExp2,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ngt-fog-exp2[fogExp2]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtInstance(NgtFogExp2Attribute),
    provideInstanceRef(NgtFogExp2Attribute),
  ],
})
export class NgtFogExp2Attribute extends NgtInstance<THREE.FogExp2> {
  @Input() set fogExp2(fogExp2: NgtFogExp2) {
    this.set({ fogExp2 });
  }

  override initTrigger$ = this.select((s) => s['fogExp2']);

  protected override initFn(
    prepareInstance: NgtPrepareInstanceFn<THREE.FogExp2>
  ): (() => void) | void | undefined {
    prepareInstance(
      make(
        THREE.FogExp2,
        this.get((s) => s['fogExp2'])
      )
    );
  }
}
