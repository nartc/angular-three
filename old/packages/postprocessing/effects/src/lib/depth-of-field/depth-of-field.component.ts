import {
  AnyConstructor,
  EnhancedRxState,
  NgtVector3,
} from '@angular-three/core';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import { NgtEffectComposerStore } from '@angular-three/postprocessing';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  NgZone,
  Optional,
  Output,
} from '@angular/core';
// @ts-ignore
import { DepthOfFieldEffect } from 'postprocessing';
import { combineLatest, startWith } from 'rxjs';
import * as THREE from 'three';

export interface NgtDepthOfFieldState {
  effect: DepthOfFieldEffect;
  options: ConstructorParameters<AnyConstructor<DepthOfFieldEffect>>[1];
  target: NgtVector3;
  depthTexture: {
    texture: THREE.Texture;
    packing: number;
  };
  blur: number;
}

@Component({
  selector: 'ngt-depth-of-field',
  template: `
    <ngt-primitive
      *ngIf="select('effect') | async as effect"
      [disabled]="true"
      [object]="$any(effect)"
      [dispose]="null"
    ></ngt-primitive>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtDepthOfField extends EnhancedRxState<NgtDepthOfFieldState> {
  @Input() set options(
    options: ConstructorParameters<AnyConstructor<DepthOfFieldEffect>>[1]
  ) {
    this.set({ options });
  }

  @Input() set target(target: NgtVector3) {
    this.set({ target });
  }

  @Input() set depthTexture(depthTexture: {
    texture: THREE.Texture;
    packing: number;
  }) {
    this.set({ depthTexture });
  }

  @Input() set blur(blur: number) {
    this.set({ blur });
  }

  #props$ = combineLatest([
    this.select('blur').pipe(startWith(undefined)),
    this.select('options').pipe(startWith({})),
    this.effectComposerStore.select('camera'),
  ]);

  #target$ = combineLatest([
    this.select('depthTexture').pipe(startWith(undefined)),
    this.select('target').pipe(startWith(undefined)),
    this.select('effect'),
  ]);

  @Output() ready = this.select('effect');

  constructor(
    private ngZone: NgZone,
    @Optional() private effectComposerStore: NgtEffectComposerStore
  ) {
    super();
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.connect('effect', this.#props$, (_, [blur, options, camera]) => {
        const effect = new DepthOfFieldEffect(camera, { ...options, blur });
        this.effectComposerStore.set((state) => ({
          effects: [...state.effects, effect],
        }));
        return effect;
      });

      this.hold(this.#target$, ([depthTexture, target, effect]) => {
        if (target) {
          effect.target =
            target instanceof THREE.Vector3
              ? new THREE.Vector3().set(target.x, target.y, target.z)
              : new THREE.Vector3().set(
                  ...(target as [number, number, number])
                );
        }

        if (depthTexture)
          effect.setDepthTexture(depthTexture.texture, depthTexture.packing);
      });
    });
  }

  get effect() {
    return this.get('effect');
  }
}

@NgModule({
  declarations: [NgtDepthOfField],
  exports: [NgtDepthOfField],
  imports: [NgtPrimitiveModule, CommonModule],
})
export class NgtDepthOfFieldModule {}
