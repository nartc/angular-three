import {
  AnyConstructor,
  NgtStore,
  NgtVector3,
  startWithUndefined,
  zonelessRequestAnimationFrame,
} from '@angular-three/core';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import { NgtEffectComposerStore } from '@angular-three/postprocessing';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  Optional,
  Output,
} from '@angular/core';
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
      *ngIf="store.select('effect') | async as effect"
      [disabled]="true"
      [object]="$any(effect)"
      [dispose]="null"
    ></ngt-primitive>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtStore],
})
export class NgtDepthOfField {
  @Input() set options(
    options: ConstructorParameters<AnyConstructor<DepthOfFieldEffect>>[1]
  ) {
    this.store.set({ options });
  }

  @Input() set target(target: NgtVector3) {
    this.store.set({ target });
  }

  @Input() set depthTexture(depthTexture: {
    texture: THREE.Texture;
    packing: number;
  }) {
    this.store.set({ depthTexture });
  }

  @Input() set blur(blur: number) {
    this.store.set({ blur });
  }

  private props$ = combineLatest([
    this.store.select('blur').pipe(startWithUndefined()),
    this.store.select('options').pipe(startWith({})),
    this.effectComposerStore.select('camera'),
  ]);

  private target$ = combineLatest([
    this.store.select('depthTexture').pipe(startWithUndefined()),
    this.store.select('target').pipe(startWithUndefined()),
    this.store.select('effect'),
  ]);

  @Output() ready = this.store.select('effect');

  constructor(
    public store: NgtStore<NgtDepthOfFieldState>,
    @Optional() private effectComposerStore: NgtEffectComposerStore
  ) {}

  ngOnInit() {
    zonelessRequestAnimationFrame(() => {
      this.store.connect(
        'effect',
        this.props$,
        (_, [blur, options, camera]) => {
          const effect = new DepthOfFieldEffect(camera, { ...options, blur });
          this.effectComposerStore.set((state) => ({
            effects: [...state.effects, effect],
          }));
          return effect;
        }
      );

      this.store.hold(this.target$, ([depthTexture, target, effect]) => {
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
    return this.store.get('effect');
  }
}

@NgModule({
  declarations: [NgtDepthOfField],
  exports: [NgtDepthOfField],
  imports: [NgtPrimitiveModule, CommonModule],
})
export class NgtDepthOfFieldModule {}
