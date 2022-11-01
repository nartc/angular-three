import * as THREE from 'three';
import {
  make,
  NgtInstance,
  NgtInstanceNode,
  provideInstanceRef,
  provideNgtInstance,
  NgtVector2
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ngt-vector2[vector2]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
      provideNgtInstance(NgtVector2Attribute),
      provideInstanceRef(NgtVector2Attribute)
  ],
})
export class NgtVector2Attribute extends NgtInstance<THREE.Vector2> {
  @Input() set vector2(vector2: NgtVector2) {
    this.set({ vector2 })
  }

  override initTrigger$ = this.select((s) => s['vector2']);

  protected override initFn(
    prepareInstance: (instance: THREE.Vector2, uuid?: string) => NgtInstanceNode
  ): (() => void) | void | undefined {
    prepareInstance(
      make(
        THREE.Vector2,
        this.get((s) => s['vector2'])
      )
    );
  }
}
