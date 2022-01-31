import {
  NGT_IS_WEBGL_AVAILABLE,
  NgtAnimationFrameStore,
  NgtCanvasStore,
  NgtStore,
  startWithUndefined,
  zonelessRequestAnimationFrame,
} from '@angular-three/core';
import { Inject, Injectable, NgZone } from '@angular/core';
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
  camera: THREE.Camera;
  scene: THREE.Scene;
  normalPass?: NormalPass;
}

@Injectable()
export class NgtEffectComposerStore extends NgtStore<NgtEffectComposerState> {
  private composerInitChanges$ = combineLatest([
    this.select('camera').pipe(startWith(this.canvasStore.get('camera'))),
    this.select('scene').pipe(startWith(this.canvasStore.get('scene'))),
    this.select('depthBuffer').pipe(startWithUndefined()),
    this.select('stencilBuffer').pipe(startWithUndefined()),
    this.select('multisampling'),
    this.select('frameBufferType').pipe(startWithUndefined()),
    this.select('disableNormalPass').pipe(startWithUndefined()),
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

  private composerSizeChanges$ = combineLatest([
    this.select('composer'),
    this.canvasStore.select('size'),
  ]).pipe(map(([composer, size]) => ({ composer, size })));

  private registerAnimationChanges$ = this.select(
    selectSlice(['composer', 'autoClear', 'renderPriority'])
  );

  private renderPassesChanges$ = combineLatest([
    this.select(selectSlice(['composer', 'effects'])),
    this.select('camera').pipe(startWith(this.canvasStore.get('camera'))),
  ]).pipe(
    map(([{ composer, effects }, camera]) => ({ composer, effects, camera }))
  );

  constructor(
    private canvasStore: NgtCanvasStore,
    private animationFrameStore: NgtAnimationFrameStore,
    zone: NgZone,
    @Inject(NGT_IS_WEBGL_AVAILABLE) private isWebGLAvailable: boolean
  ) {
    super();
    this.set({
      autoClear: true,
      multisampling: 8,
      renderPriority: 1,
      camera: canvasStore.get('camera'),
      scene: canvasStore.get('scene'),
      effects: [],
    });
  }

  /**
   * zoneless
   */
  init() {
    zonelessRequestAnimationFrame(() => {
      this.connect('camera', this.canvasStore.select('camera'));
      this.connect('scene', this.canvasStore.select('scene'));

      this.hold(
        this.composerInitChanges$,
        ({
          scene,
          camera,
          disableNormalPass,
          frameBufferType,
          stencilBuffer,
          multisampling,
          depthBuffer,
        }) => {
          const renderer = this.canvasStore.get('renderer');
          if (renderer && scene && camera) {
            const effectComposer = new EffectComposer(renderer, {
              depthBuffer: depthBuffer as boolean | undefined,
              stencilBuffer: stencilBuffer as boolean | undefined,
              multisampling: this.isWebGLAvailable ? multisampling : 0,
              frameBufferType: frameBufferType as
                | THREE.TextureDataType
                | undefined,
            });

            effectComposer.addPass(new RenderPass(scene, camera));

            const normalPass = disableNormalPass
              ? undefined
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

      this.hold(this.composerSizeChanges$, ({ composer, size }) => {
        if (composer) {
          composer.setSize(size.width, size.height);
        }
      });

      this.effect(
        this.registerAnimationChanges$,
        ({ composer, autoClear, renderPriority }) => {
          const renderer = this.canvasStore.get('renderer');
          const animationUuid = this.animationFrameStore.register({
            callback: ({ delta }) => {
              renderer.autoClear = autoClear;
              composer.render(delta);
            },
            priority: renderPriority,
          });
          return () => {
            this.animationFrameStore.actions.unregister(animationUuid);
          };
        }
      );

      this.effect(
        this.renderPassesChanges$,
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
    });
  }
}
