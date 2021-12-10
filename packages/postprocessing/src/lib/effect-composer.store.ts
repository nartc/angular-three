// @ts-nocheck
import {
  EnhancedRxState,
  NGT_IS_WEBGL_AVAILABLE,
  NgtAnimationFrameStore,
  NgtStore,
} from '@angular-three/core';
import { Inject, Injectable } from '@angular/core';
import { requestAnimationFrame } from '@rx-angular/cdk/zone-less';
import { selectSlice } from '@rx-angular/state';
import {
  Effect,
  EffectComposer,
  EffectPass,
  NormalPass,
  RenderPass,
} from 'postprocessing';
import { combineLatest, map, startWith } from 'rxjs';
import * as THREE from 'three';

export interface NgtEffectComposerState {
  autoClear: boolean;
  multisampling: number;
  renderPriority: number;
  composer: EffectComposer;
  depthBuffer?: boolean;
  disableNormalPass?: boolean;
  stencilBuffer?: boolean;
  effects: Effect[];
  frameBufferType?: THREE.TextureDataType;
  camera?: THREE.Camera;
  scene?: THREE.Scene;
  normalPass?: NormalPass;
}

@Injectable()
export class NgtEffectComposerStore extends EnhancedRxState<NgtEffectComposerState> {
  #composerInitChanges$ = combineLatest([
    this.select('camera').pipe(startWith(this.store.get('camera'))),
    this.select('scene').pipe(startWith(this.store.get('scene'))),
    this.select('depthBuffer').pipe(startWith(undefined)),
    this.select('stencilBuffer').pipe(startWith(undefined)),
    this.select('multisampling'),
    this.select('frameBufferType').pipe(startWith(undefined)),
    this.select('disableNormalPass').pipe(startWith(undefined)),
  ]).pipe(
    map(
      ([
        camera,
        scene,
        depthBuffer,
        stencilBuffer,
        multisampling,
        frameBufferType,
        disableNormalPass,
      ]) => ({
        camera,
        scene,
        depthBuffer,
        stencilBuffer,
        multisampling,
        frameBufferType,
        disableNormalPass,
      })
    )
  );

  #composerSizeChanges$ = combineLatest([
    this.select('composer'),
    this.store.select('size'),
  ]).pipe(map(([composer, size]) => ({ composer, size })));

  #registerAnimationChanges$ = this.select(
    selectSlice(['composer', 'autoClear', 'renderPriority'])
  );

  #renderPassesChanges$ = combineLatest([
    this.select(selectSlice(['composer', 'effects'])),
    this.select('camera').pipe(startWith(this.store.get('camera'))),
  ]).pipe(
    map(([{ composer, effects }, camera]) => ({ composer, effects, camera }))
  );

  constructor(
    private store: NgtStore,
    animationFrameStore: NgtAnimationFrameStore,
    @Inject(NGT_IS_WEBGL_AVAILABLE) isWebGLAvailable: boolean
  ) {
    super();
    this.set({
      depthBuffer: undefined,
      disableNormalPass: undefined,
      stencilBuffer: undefined,
      autoClear: true,
      multisampling: 8,
      renderPriority: 1,
      frameBufferType: undefined,
      camera: store.get('camera'),
      scene: store.get('scene'),
      effects: [],
      normalPass: undefined,
    });

    this.connect('camera', store.select('camera'));
    this.connect('scene', store.select('scene'));

    this.hold(
      this.#composerInitChanges$,
      ({
        scene,
        camera,
        disableNormalPass,
        frameBufferType,
        stencilBuffer,
        multisampling,
        depthBuffer,
      }) => {
        const renderer = this.store.get('renderer');
        if (scene && camera) {
          const effectComposer = new EffectComposer(renderer, {
            depthBuffer,
            stencilBuffer,
            multisampling: isWebGLAvailable ? multisampling : 0,
            frameBufferType,
          });

          effectComposer.addPass(new RenderPass(scene, camera));

          const normalPass = disableNormalPass
            ? null
            : new NormalPass(scene, camera);
          if (normalPass) {
            effectComposer.addPass(normalPass);
          }

          this.set({
            normalPass,
            composer: effectComposer,
          });
        }
      }
    );

    this.hold(this.#composerSizeChanges$, ({ composer, size }) => {
      if (composer) {
        composer.setSize(size.width, size.height);
      }
    });

    this.holdEffect(
      this.#registerAnimationChanges$,
      ({ composer, autoClear, renderPriority }) => {
        const renderer = this.store.get('renderer');
        let animationUuid: string;
        // TODO: for some reason, without queueing this, this animation gets registered and then removed automatically
        requestAnimationFrame(() => {
          animationUuid = animationFrameStore.register({
            callback: ({ delta }) => {
              renderer.autoClear = autoClear;
              composer.render(delta);
            },
            priority: renderPriority,
          });
        });
        return () => {
          animationFrameStore.actions.unsubscriberUuid(animationUuid);
        };
      }
    );

    this.holdEffect(
      this.#renderPassesChanges$,
      ({ composer, effects, camera }) => {
        let effectPass: EffectPass;

        if (effects.length) {
          effectPass = new EffectPass(camera, ...effects);
          composer.addPass(effectPass);
          effectPass.renderToScreen = true;
        }

        return () => {
          if (effectPass) {
            composer.removePass(effectPass);
          }
        };
      }
    );
  }
}
