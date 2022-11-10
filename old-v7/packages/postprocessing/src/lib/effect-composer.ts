import {
  coerceBoolean,
  coerceNumber,
  getInstanceLocalState,
  NgtBooleanInput,
  NgtNumberInput,
  NgtObservableInput,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
  skipFirstUndefined,
  tapEffect,
} from '@angular-three/core';
import { NgtGroup } from '@angular-three/core/objects';
import { Component, Input } from '@angular/core';
import { DepthDownsamplingPass, EffectComposer, EffectPass, NormalPass, RenderPass } from 'postprocessing';
import { animationFrameScheduler, filter, isObservable, map, observeOn, switchMap, tap } from 'rxjs';
import * as THREE from 'three';
import { isWebGL2Available } from 'three-stdlib';

@Component({
  selector: 'ngt-effect-composer',
  standalone: true,
  template: `
    <ngt-group [ref]="instanceRef">
      <ng-content></ng-content>
    </ngt-group>
  `,
  imports: [NgtGroup],
  providers: [
    provideNgtObject(NgtEffectComposer),
    provideObjectRef(NgtEffectComposer),
    provideObjectHostRef(NgtEffectComposer),
  ],
})
export class NgtEffectComposer extends NgtGroup {
  override isWrapper = true;

  @Input() set enabled(enabled: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      enabled: isObservable(enabled) ? enabled.pipe(map(coerceBoolean)) : coerceBoolean(enabled),
    });
  }

  @Input() set depthBuffer(depthBuffer: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      depthBuffer: isObservable(depthBuffer) ? depthBuffer.pipe(map(coerceBoolean)) : coerceBoolean(depthBuffer),
    });
  }

  @Input() set disableNormalPass(disableNormalPass: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      disableNormalPass: isObservable(disableNormalPass)
        ? disableNormalPass.pipe(map(coerceBoolean))
        : coerceBoolean(disableNormalPass),
    });
  }

  @Input() set stencilBuffer(stencilBuffer: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      stencilBuffer: isObservable(stencilBuffer)
        ? stencilBuffer.pipe(map(coerceBoolean))
        : coerceBoolean(stencilBuffer),
    });
  }

  @Input() set autoClear(autoClear: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      autoClear: isObservable(autoClear) ? autoClear.pipe(map(coerceBoolean)) : coerceBoolean(autoClear),
    });
  }

  @Input() set resolutionScale(resolutionScale: NgtObservableInput<NgtNumberInput>) {
    this.set({
      resolutionScale: isObservable(resolutionScale)
        ? resolutionScale.pipe(map(coerceNumber))
        : coerceNumber(resolutionScale),
    });
  }

  @Input() set multisampling(multisampling: NgtObservableInput<NgtNumberInput>) {
    this.set({
      multisampling: isObservable(multisampling) ? multisampling.pipe(map(coerceNumber)) : coerceNumber(multisampling),
    });
  }

  @Input() set frameBufferType(frameBufferType: THREE.TextureDataType) {
    this.set({ frameBufferType });
  }

  @Input() set renderPriority(renderPriority: NgtObservableInput<NgtNumberInput>) {
    this.set({
      renderPriority: isObservable(renderPriority)
        ? renderPriority.pipe(map(coerceNumber))
        : coerceNumber(renderPriority),
    });
  }

  @Input() set camera(camera: NgtObservableInput<THREE.Camera>) {
    this.set({ camera });
  }

  @Input() set scene(scene: NgtObservableInput<THREE.Scene>) {
    this.set({ scene });
  }

  get composer(): EffectComposer {
    return this.getState((s) => s['effectComposer']) as EffectComposer;
  }

  private readonly initComposer = this.effect(
    tap(() => {
      const { gl } = this.store.getState();
      const {
        scene,
        camera,
        depthBuffer,
        stencilBuffer,
        multisampling,
        frameBufferType,
        disableNormalPass,
        resolutionScale,
      } = this.getState();

      const webGL2Available = isWebGL2Available();
      // Initialize composer
      const effectComposer = new EffectComposer(gl, {
        depthBuffer,
        stencilBuffer,
        multisampling: multisampling > 0 && webGL2Available ? multisampling : 0,
        frameBufferType,
      });

      // add RenderPass
      effectComposer.addPass(new RenderPass(scene, camera));

      // Create normal pass
      let downSamplingPass = null;
      let normalPass = null;
      if (!disableNormalPass) {
        normalPass = new NormalPass(scene, camera);
        normalPass.enabled = false;
        effectComposer.addPass(normalPass);
        if (resolutionScale !== undefined && webGL2Available) {
          downSamplingPass = new DepthDownsamplingPass({
            normalBuffer: normalPass.texture,
            resolutionScale,
          });
          downSamplingPass.enabled = false;
          effectComposer.addPass(downSamplingPass);
        }
      }

      this.set({ normalPass, downSamplingPass, effectComposer });
    })
  );

  private readonly setComposerSize = this.effect(
    tap(() => {
      const effectComposer = this.getState((s) => s['effectComposer']);
      const { width, height, updateStyle } = this.store.getState((s) => s.size);
      if (effectComposer) {
        (effectComposer as EffectComposer).setSize(width, height, updateStyle);
      }
    })
  );

  private readonly setBeforeRender = this.effect<void>(
    tapEffect(() => {
      const { enabled, autoClear, renderPriority } = this.getState();
      const gl = this.store.getState((s) => s.gl);
      return this.store.registerBeforeRender({
        priority: enabled ? renderPriority : 0,
        callback: ({ delta }) => {
          const effectComposer = this.getState((s) => s['effectComposer']);
          if (enabled && effectComposer) {
            gl.autoClear = autoClear;
            effectComposer.render(delta);
          }
        },
      });
    })
  );

  private readonly handleEffectPasses = this.effect(
    tapEffect(() => {
      const { effectComposer, camera, normalPass, downSamplingPass } = this.getState();
      const groupLocalState = this.__ngt__;

      let effectPass: EffectPass;

      if (groupLocalState && effectComposer) {
        effectPass = new EffectPass(camera, ...groupLocalState.instancesRefs.value.map((ref) => ref.value));
        effectPass.renderToScreen = true;
        effectComposer.addPass(effectPass);
        if (normalPass) normalPass.enabled = true;
        if (downSamplingPass) downSamplingPass.enabled = true;
      }

      return () => {
        if (effectPass && effectComposer) {
          effectComposer.removePass(effectPass);
        }
        if (normalPass) normalPass.enabled = false;
        if (downSamplingPass) downSamplingPass.enabled = false;
      };
    })
  );

  override initialize() {
    super.initialize();
    this.set({
      enabled: true,
      renderPriority: 1,
      autoClear: true,
      multisampling: 8,
      frameBufferType: THREE.HalfFloatType,
    });
  }

  override postStoreReady() {
    super.postStoreReady();
    this.set((s) => ({
      scene: s['scene'] ?? this.store.getState((s) => s.scene),
      camera: s['camera'] ?? this.store.getState((s) => s.camera),
    }));
  }

  override postInit() {
    super.postInit();
    this.initComposer(
      this.select(
        this.store.select((s) => s.gl),
        this.select((s) => s['camera']),
        this.select((s) => s['depthBuffer']),
        this.select((s) => s['stencilBuffer']),
        this.select((s) => s['multisampling']),
        this.select((s) => s['frameBufferType']),
        this.select((s) => s['scene']),
        this.select((s) => s['disableNormalPass']),
        this.select((s) => s['resolutionScale']),
        this.defaultProjector,
        { debounce: true }
      )
    );

    this.setComposerSize(
      this.select(
        this.select((s) => s['effectComposer']).pipe(skipFirstUndefined()),
        this.store.select((s) => s.size),
        this.defaultProjector,
        { debounce: true }
      )
    );

    this.setBeforeRender();
    this.handleEffectPasses(
      this.select(
        this.select((s) => s['effectComposer']).pipe(skipFirstUndefined()),
        this.select((s) => s['camera']),
        this.select((s) => s['normalPass']),
        this.select((s) => s['downSamplingPass']),
        this.instanceRef.pipe(
          switchMap((group) => getInstanceLocalState(group)!.instancesRefs),
          filter((objects) => objects.length > 0),
          observeOn(animationFrameScheduler)
        ),
        this.defaultProjector,
        { debounce: true }
      )
    );
  }
}
