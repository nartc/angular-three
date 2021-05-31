import type { UnknownRecord } from '@angular-three/core';
import { applyProps, ThreeMaterial, ThreeObject3d } from '@angular-three/core';
import {
  Directive,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Optional,
} from '@angular/core';
import { animate } from 'popmotion';
import type { Material, Object3D } from 'three';
import { THREE_POPABLE } from '../di';

export interface Popable {
  (): Object3D | Material | null;
}

export function popableFactory(
  object3d?: ThreeObject3d,
  material?: ThreeMaterial
) {
  // noinspection UnnecessaryLocalVariableJS
  const getter = () => {
    if (material) return material.material;
    if (object3d) return object3d.object3d;
    return null;
  };
  return getter;
}

@Directive({
  selector: '[ngtPop]',
  providers: [
    {
      provide: THREE_POPABLE,
      useFactory: popableFactory,
      deps: [
        [new Optional(), ThreeObject3d],
        [new Optional(), ThreeMaterial],
      ],
    },
  ],
})
export class PopmotionDirective implements OnChanges, OnDestroy {
  @Input('ngtPop') config: any;
  @Input() ngtPopConfig: any;
  @Input() ngtPopValueGetter?: any;

  private animationStop?: { stop: () => void };

  constructor(
    private readonly ngZone: NgZone,
    @Inject(THREE_POPABLE)
    private readonly popable: Popable
  ) {}

  ngOnChanges() {
    this.ngZone.runOutsideAngular(() => {
      this.stop();

      const popable = this.popable();
      if (popable == null) return;
      const [attachTo, attachToValue] = this.config;
      this.animationStop = animate({
        ...(this.ngtPopConfig || {}),
        to: [
          this.ngtPopValueGetter
            ? (
                (
                  (popable as unknown as UnknownRecord)[
                    attachTo
                  ] as UnknownRecord
                )[this.ngtPopValueGetter] as () => unknown
              )()
            : (popable as unknown as UnknownRecord)[attachTo],
          attachToValue,
        ],
        onUpdate: (latest) => {
          applyProps(popable as any, { [attachTo]: latest });
        },
      });
    });
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      this.stop();
    });
  }

  private stop() {
    if (this.animationStop) {
      this.animationStop.stop();
    }
  }
}
