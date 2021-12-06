// @ts-nocheck
import {
  EnhancedComponentStore,
  NGT_IS_WEBGL_AVAILABLE,
  NgtAnimationFrameStore,
  NgtSize,
  NgtStore,
  tapEffect,
} from '@angular-three/core';
import { Inject, Injectable, NgZone } from '@angular/core';

import {
  Effect,
  EffectComposer,
  EffectPass,
  NormalPass,
  RenderPass,
} from 'postprocessing';
import { Observable, tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';

export interface NgtEffectComposerState {
  autoClear: boolean;
  multisampling: number;
  renderPriority: number;
  depthBuffer?: boolean;
  disableNormalPass?: boolean;
  stencilBuffer?: boolean;
  effects: Effect[];
  frameBufferType?: THREE.TextureDataType;
  camera?: THREE.Camera;
  scene?: THREE.Scene;
  normalPass?: NormalPass;
  composer?: EffectComposer;
}

interface ComposerInitChanges {
  multisampling: number;
  depthBuffer?: boolean;
  disableNormalPass?: boolean;
  stencilBuffer?: boolean;
  frameBufferType?: THREE.TextureDataType;
  camera?: THREE.Camera;
  scene?: THREE.Scene;
}

@Injectable()
export class NgtEffectComposerStore extends EnhancedComponentStore<NgtEffectComposerState> {
  #composerInitChanges$: Observable<ComposerInitChanges> = this.select(
    this.selectors.camera$,
    this.selectors.depthBuffer$,
    this.selectors.stencilBuffer$,
    this.selectors.multisampling$,
    this.selectors.frameBufferType$,
    this.selectors.scene$,
    this.selectors.disableNormalPass$,
    (
      camera,
      depthBuffer,
      stencilBuffer,
      multisampling,
      frameBufferType,
      scene,
      disableNormalPass
    ) => ({
      camera,
      depthBuffer,
      stencilBuffer,
      multisampling,
      frameBufferType,
      scene,
      disableNormalPass,
    }),
    { debounce: true }
  );

  #composerSizeChanges$ = this.select(
    this.store.selectors.size$,
    this.selectors.composer$,
    (size, composer) => ({ size, composer }),
    { debounce: true }
  );

  #registerAnimationChanges$ = this.select(
    this.selectors.composer$,
    this.selectors.autoClear$,
    this.selectors.renderPriority$,
    (composer, autoClear, renderPriority) => ({
      composer,
      autoClear,
      renderPriority,
    }),
    { debounce: true }
  );

  #renderPassesChanges$ = this.select(
    this.selectors.composer$,
    this.selectors.effects$,
    this.selectors.camera$,
    (composer, effects, camera) => ({
      composer,
      effects: effects.filter(Boolean),
      camera,
    }),
    { debounce: true }
  );

  constructor(
    private store: NgtStore,
    private animationFrameStore: NgtAnimationFrameStore,
    private ngZone: NgZone,
    @Inject(NGT_IS_WEBGL_AVAILABLE) private isWebGLAvailable: boolean
  ) {
    super({
      depthBuffer: undefined,
      disableNormalPass: undefined,
      stencilBuffer: undefined,
      autoClear: true,
      multisampling: 8,
      renderPriority: 1,
      frameBufferType: undefined,
      camera: store.getImperativeState().camera,
      scene: store.getImperativeState().scene,
      effects: [],
      normalPass: undefined,
      composer: undefined,
    });
  }

  readonly init = this.effect(($) =>
    $.pipe(
      tap(() => {
        this.updaters.setCamera(this.store.getImperativeState().camera);
        this.updaters.setScene(this.store.getImperativeState().scene);

        this.#initComposer(this.#composerInitChanges$);
        this.#composeSizeChange(this.#composerSizeChanges$);
        this.#registerAnimation(this.#registerAnimationChanges$);
        this.#listenEffectsChange(this.#renderPassesChanges$);
      })
    )
  );

  #initComposer = this.effect<ComposerInitChanges>((changes$) =>
    changes$.pipe(
      withLatestFrom(this.store.selectors.renderer$),
      tap(
        ([
          {
            depthBuffer,
            stencilBuffer,
            multisampling,
            frameBufferType,
            scene,
            disableNormalPass,
            camera,
          },
          renderer,
        ]) => {
          this.ngZone.runOutsideAngular(() => {
            if (scene && camera) {
              const effectComposer = new EffectComposer(renderer, {
                depthBuffer,
                stencilBuffer,
                multisampling: this.isWebGLAvailable ? multisampling : 0,
                frameBufferType,
              });

              effectComposer.addPass(new RenderPass(scene, camera));

              const normalPass = disableNormalPass
                ? null
                : new NormalPass(scene, camera);
              if (normalPass) {
                effectComposer.addPass(normalPass);
              }

              this.patchState({
                composer: effectComposer,
                normalPass,
              });
            }
          });
        }
      )
    )
  );

  #composeSizeChange = this.effect<{
    composer: EffectComposer;
    size: NgtSize;
  }>((changes$) =>
    changes$.pipe(
      tap(({ composer, size }) => {
        this.ngZone.runOutsideAngular(() => {
          if (composer) {
            composer.setSize(size.width, size.height);
          }
        });
      })
    )
  );

  #listenEffectsChange = this.effect<{
    camera?: THREE.Camera;
    effects: Effect[];
    composer?: EffectComposer;
  }>((changes$) =>
    changes$.pipe(
      tapEffect(({ effects, camera, composer }) => {
        let effectPass: EffectPass;

        this.ngZone.runOutsideAngular(() => {
          if (camera && composer && effects.length) {
            effectPass = new EffectPass(camera, ...effects);
            composer.addPass(effectPass);
            effectPass.renderToScreen = true;
          }
        });

        return () => {
          this.ngZone.runOutsideAngular(() => {
            if (effectPass && composer) {
              composer.removePass(effectPass);
            }
          });
        };
      })
    )
  );

  #registerAnimation = this.effect<{
    composer: EffectComposer;
    autoClear: boolean;
    renderPriority: number;
  }>((changes$) =>
    changes$.pipe(
      withLatestFrom(this.store.selectors.renderer$),
      tapEffect(([{ composer, autoClear, renderPriority }, renderer]) => {
        const animationSubscription = this.ngZone.runOutsideAngular(() => {
          if (composer && renderer) {
            return this.animationFrameStore.register({
              priority: renderPriority,
              callback: ({ delta }) => {
                renderer.autoClear = autoClear;
                composer.render(delta);
              },
              obj: null,
            });
          }

          return null;
        });

        return () => {
          if (animationSubscription) {
            animationSubscription.unsubscribe();
          }
        };
      })
    )
  );
}
