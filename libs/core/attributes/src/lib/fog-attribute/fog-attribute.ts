import * as THREE from 'three';
import {
  make,
  NgtInstance,
  NgtInstanceNode,
  provideInstanceRef,
  provideNgtInstance,
  NgtFog
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ngt-fog[fog]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
      provideNgtInstance(NgtFogAttribute),
      provideInstanceRef(NgtFogAttribute)
  ],
})
export class NgtFogAttribute extends NgtInstance<THREE.Fog> {
  @Input() set fog(fog: NgtFog) {
    this.set({ fog })
  }

  override initTrigger$ = this.select((s) => s['fog']);

  protected override initFn(
    prepareInstance: (instance: THREE.Fog, uuid?: string) => NgtInstanceNode
  ): (() => void) | void | undefined {
    prepareInstance(
      make(
        THREE.Fog,
        this.get((s) => s['fog'])
      )
    );
  }
}
