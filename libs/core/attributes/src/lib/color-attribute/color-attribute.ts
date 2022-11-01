import * as THREE from 'three';
import {
  make,
  NgtInstance,
  NgtInstanceNode,
  provideInstanceRef,
  provideNgtInstance,
  NgtColor
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ngt-color[color]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
      provideNgtInstance(NgtColorAttribute),
      provideInstanceRef(NgtColorAttribute)
  ],
})
export class NgtColorAttribute extends NgtInstance<THREE.Color> {
  @Input() set color(color: NgtColor) {
    this.set({ color })
  }

  override initTrigger$ = this.select((s) => s['color']);

  protected override initFn(
    prepareInstance: (instance: THREE.Color, uuid?: string) => NgtInstanceNode
  ): (() => void) | void | undefined {
    prepareInstance(
      make(
        THREE.Color,
        this.get((s) => s['color'])
      )
    );
  }
}
