import {
  AnyFunction,
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NGT_INSTANCE_HOST_REF,
  NGT_INSTANCE_REF,
  NGT_IS_WEBGL_AVAILABLE,
  NgtInstance,
  NgtInstanceState,
  NgtStore,
  NgtUnknownInstance,
  NumberInput,
  provideInstanceRef,
  Ref,
  startWithUndefined,
  tapEffect,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Inject, Input, NgModule, NgZone, Optional, SkipSelf } from '@angular/core';
import { DepthDownsamplingPass, EffectComposer, EffectPass, NormalPass, RenderPass } from 'postprocessing';
import { debounceTime, defer, map, of, pipe, tap } from 'rxjs';
import * as THREE from 'three';

export interface NgtEffectComposerState extends NgtInstanceState<EffectComposer> {
  normalPass: NormalPass | null;
  depthDownSamplingPass: DepthDownsamplingPass | null;

  renderPriority: number;
  autoClear: boolean;
  multisampling: number;
  frameBufferType: THREE.TextureDataType;
  enabled: boolean;
  depthBuffer?: boolean;
  disableNormalPass?: boolean;
  stencilBuffer?: boolean;
  resolutionScale?: number;
  camera?: THREE.Camera;
  scene?: THREE.Scene;
}

@Component({
  selector: 'ngt-effect-composer',
  template: ` <ng-content></ng-content> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideInstanceRef(NgtEffectComposer)],
})
export class NgtEffectComposer extends NgtInstance<EffectComposer, NgtEffectComposerState> {
  @Input() set enabled(enabled: BooleanInput) {
    this.set({ enabled: coerceBooleanProperty(enabled) });
  }

  @Input() set depthBuffer(depthBuffer: BooleanInput) {
    this.set({ depthBuffer: coerceBooleanProperty(depthBuffer) });
  }

  @Input() set disableNormalPass(disableNormalPass: BooleanInput) {
    this.set({
      disableNormalPass: coerceBooleanProperty(disableNormalPass),
    });
  }

  @Input() set stencilBuffer(stencilBuffer: BooleanInput) {
    this.set({ stencilBuffer: coerceBooleanProperty(stencilBuffer) });
  }

  @Input() set autoClear(autoClear: BooleanInput) {
    this.set({ autoClear: coerceBooleanProperty(autoClear) });
  }

  @Input() set resolutionScale(resolutionScale: NumberInput) {
    this.set({ resolutionScale: coerceNumberProperty(resolutionScale) });
  }

  @Input() set multisampling(multisampling: NumberInput) {
    this.set({ multisampling: coerceNumberProperty(multisampling) });
  }

  @Input() set frameBufferType(frameBufferType: THREE.TextureDataType) {
    this.set({ frameBufferType });
  }

  @Input() set renderPriority(renderPriority: NumberInput) {
    this.set({ renderPriority: coerceNumberProperty(renderPriority) });
  }

  @Input() set camera(camera: THREE.Camera) {
    this.set({ camera });
  }

  @Input() set scene(scene: THREE.Scene) {
    this.set({ scene });
  }

  private readonly composerInitParams$ = this.select(
    this.store.select((s) => s.gl),
    this.select((s) => s.camera),
    this.select((s) => s.scene),
    this.select((s) => s.depthBuffer).pipe(startWithUndefined()),
    this.select((s) => s.stencilBuffer).pipe(startWithUndefined()),
    this.select((s) => s.multisampling),
    this.select((s) => s.frameBufferType),
    this.select((s) => s.disableNormalPass).pipe(startWithUndefined()),
    this.select((s) => s.resolutionScale).pipe(startWithUndefined())
  );

  private readonly sizeParams$ = this.select(
    this.instance,
    this.store.select((s) => s.size)
  );

  private readonly beforeRenderParams$ = this.select(
    this.instance,
    this.select((s) => s.autoClear),
    this.select((s) => s.enabled),
    this.select((s) => s.renderPriority)
  );

  private readonly effectPassesParams$ = this.select(
    this.select((s) => s.camera),
    this.select((s) => s.normalPass),
    this.select((s) => s.depthDownSamplingPass),
    this.instance,
    defer(() => {
      if (this.instance.value) {
        return (this.instance.value as unknown as NgtUnknownInstance).__ngt__.objects;
      }
      return of(null);
    })
  );

  constructor(
    zone: NgZone,
    store: NgtStore,
    @Optional()
    @SkipSelf()
    @Inject(NGT_INSTANCE_REF)
    parentRef: AnyFunction<Ref>,
    @Optional()
    @SkipSelf()
    @Inject(NGT_INSTANCE_HOST_REF)
    parentHostRef: AnyFunction<Ref>,
    @Inject(NGT_IS_WEBGL_AVAILABLE)
    private isWebGLAvailable: boolean
  ) {
    super(zone, store, parentRef, parentHostRef);
  }

  protected override preInit() {
    this.set((state) => ({
      enabled: state.enabled || true,
      renderPriority: state.renderPriority || 1,
      autoClear: state.autoClear || true,
      multisampling: state.multisampling || 8,
      camera: state.camera || this.store.get((s) => s.camera),
      scene: state.scene || this.store.get((s) => s.scene),
      frameBufferType: state.frameBufferType || THREE.HalfFloatType,
    }));
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(this.store.ready$, () => {
        this.set(this.store.select((s) => s.camera).pipe(map((camera) => ({ camera }))));
        this.set(this.store.select((s) => s.scene).pipe(map((scene) => ({ scene }))));

        this.init(this.composerInitParams$);
        this.setSize(this.sizeParams$);
        this.setBeforeRender(this.beforeRenderParams$);
        this.effectPasses(this.effectPassesParams$);
      });
    });
  }

  private readonly init = this.effect<{}>(
    tap(() => {
      const { gl } = this.store.get();
      const {
        scene,
        camera,
        depthBuffer,
        stencilBuffer,
        multisampling,
        frameBufferType,
        disableNormalPass,
        resolutionScale,
      } = this.get();

      if (gl && scene && camera) {
        const effectComposer = this.prepareInstance(
          new EffectComposer(gl, {
            depthBuffer,
            stencilBuffer,
            multisampling: multisampling > 0 && this.isWebGLAvailable ? multisampling : 0,
            frameBufferType,
          })
        );

        effectComposer.addPass(new RenderPass(scene, camera));

        // Create normal pass
        let downSamplingPass = null;
        let normalPass = null;

        if (!disableNormalPass) {
          normalPass = new NormalPass(scene, camera);
          normalPass.enabled = false;
          effectComposer.addPass(normalPass);
          if (resolutionScale !== undefined && this.isWebGLAvailable) {
            downSamplingPass = new DepthDownsamplingPass({
              normalBuffer: normalPass.texture,
              resolutionScale,
            });
            downSamplingPass.enabled = false;
            effectComposer.addPass(downSamplingPass);
          }
        }

        this.set({
          depthDownSamplingPass: downSamplingPass,
          normalPass,
        } as Partial<NgtEffectComposerState>);
      }
    })
  );

  private readonly setSize = this.effect<{}>(
    tap(() => {
      const composer = this.get((s) => s.instance);
      if (composer.value) {
        const size = this.store.get((s) => s.size);
        composer.value.setSize(size.width, size.height);
      }
    })
  );

  private readonly setBeforeRender = this.effect<{}>(
    tapEffect(() => {
      const { renderPriority, enabled } = this.get();
      const gl = this.store.get((s) => s.gl);
      const unregister = this.store.registerBeforeRender({
        callback: ({ delta }) => {
          const { instance: composer, autoClear } = this.get();

          if (enabled && composer.value) {
            gl.autoClear = autoClear;
            composer.value.render(delta);
          }
        },
        priority: enabled ? renderPriority : 0,
      });

      return () => {
        unregister();
      };
    })
  );

  private readonly effectPasses = this.effect<{}>(
    pipe(
      debounceTime(150),
      tapEffect(() => {
        let effectPass: EffectPass;
        const { instance: composer, camera, normalPass, depthDownSamplingPass } = this.get();
        if (
          composer.value &&
          (composer.value as unknown as NgtUnknownInstance).__ngt__.objects.value.length &&
          camera
        ) {
          effectPass = new EffectPass(
            camera,
            ...(composer.value as unknown as NgtUnknownInstance).__ngt__.objects.value.map((ref) => ref.value)
          );
          effectPass.renderToScreen = true;
          composer.value.addPass(effectPass);
          if (normalPass) {
            normalPass.enabled = true;
          }

          if (depthDownSamplingPass) {
            depthDownSamplingPass.enabled = true;
          }
        }

        return () => {
          if (effectPass) {
            composer.value?.removePass(effectPass);
          }

          if (normalPass) {
            normalPass.enabled = false;
          }

          if (depthDownSamplingPass) {
            depthDownSamplingPass.enabled = false;
          }
        };
      })
    )
  );
}

@NgModule({
  declarations: [NgtEffectComposer],
  exports: [NgtEffectComposer],
})
export class NgtEffectComposerModule {}
