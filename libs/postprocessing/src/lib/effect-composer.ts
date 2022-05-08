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
  provideObjectHostRef,
  Ref,
  startWithUndefined,
  tapEffect,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  Inject,
  Input,
  NgModule,
  NgZone,
  Optional,
  SkipSelf,
  TemplateRef,
} from '@angular/core';
import { DepthDownsamplingPass, EffectComposer, EffectPass, NormalPass, RenderPass } from 'postprocessing';
import { filter, startWith, switchMap, tap } from 'rxjs';
import * as THREE from 'three';

export interface NgtEffectComposerState extends NgtInstanceState<EffectComposer> {
  groupRef: Ref<NgtUnknownInstance<THREE.Group>>;

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

@Directive({
  selector: 'ng-template[ngt-effect-composer-content]',
})
export class NgtEffectComposerContent {
  constructor(public templateRef: TemplateRef<{ group: Ref<THREE.Group>; effectComposer: Ref<EffectComposer> }>) {}

  static ngTemplateContextGuard(
    dir: NgtEffectComposerContent,
    ctx: any
  ): ctx is { group: Ref<THREE.Group>; effectComposer: Ref<EffectComposer> } {
    return true;
  }
}

@Component({
  selector: 'ngt-effect-composer',
  template: `
    <ngt-group [ref]="groupRef">
      <ng-container
        *ngIf="content"
        [ngTemplateOutlet]="content.templateRef"
        [ngTemplateOutletContext]="{ group: groupRef, effectComposer: instance }"
      ></ng-container>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideInstanceRef(NgtEffectComposer),
    provideObjectHostRef(NgtEffectComposer, (composer) => composer.groupRef),
  ],
})
export class NgtEffectComposer extends NgtInstance<EffectComposer, NgtEffectComposerState> implements AfterViewInit {
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

  @ContentChild(NgtEffectComposerContent) content?: NgtEffectComposerContent;

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
    this.instance$,
    this.store.select((s) => s.size)
  );

  private readonly beforeRenderParams$ = this.select(
    this.instance$,
    this.select((s) => s.autoClear),
    this.select((s) => s.enabled),
    this.select((s) => s.renderPriority)
  );

  get groupRef() {
    return this.get((s) => s.groupRef);
  }

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
    super.preInit();
    this.set((state) => ({
      groupRef: new Ref(),
      enabled: state.enabled ?? true,
      renderPriority: state.renderPriority ?? 1,
      autoClear: state.autoClear ?? true,
      multisampling: state.multisampling ?? 8,
      camera: state.camera ?? this.store.get((s) => s.camera),
      scene: state.scene ?? this.store.get((s) => s.scene),
      frameBufferType: state.frameBufferType ?? THREE.HalfFloatType,
    }));
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(this.store.ready$, () => {
        const effectPassesParams$ = this.select(
          this.select((s) => s.camera),
          this.select((s) => s.normalPass),
          this.select((s) => s.depthDownSamplingPass),
          this.instance$,
          this.groupRef.pipe(filter((group) => !!group)),
          this.groupRef.pipe(
            filter((group) => !!group),
            switchMap((group) => group.__ngt__.objects),
            startWith([])
          )
        );

        this.init(this.composerInitParams$);
        this.setSize(this.sizeParams$);
        this.setBeforeRender(this.beforeRenderParams$);
        this.effectPasses(effectPassesParams$);
      });
    });
  }

  private readonly init = this.effect<{}>(
    tap(() => {
      const { gl, scene: defaultScene, camera: defaultCamera } = this.store.get();
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

      const initScene = scene || defaultScene;
      const initCamera = camera || defaultCamera;

      if (gl && initScene && initCamera) {
        const effectComposer = this.prepareInstance(
          new EffectComposer(gl, {
            depthBuffer,
            stencilBuffer,
            multisampling: multisampling > 0 && this.isWebGLAvailable ? multisampling : 0,
            frameBufferType,
          })
        );

        effectComposer.addPass(new RenderPass(initScene, initCamera));

        // Create normal pass
        let downSamplingPass = null;
        let normalPass = null;

        if (!disableNormalPass) {
          normalPass = new NormalPass(initScene, initCamera);
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
      const { renderPriority, enabled, instance: composer, autoClear } = this.get();
      const gl = this.store.get((s) => s.gl);

      return this.store.registerBeforeRender({
        callback: ({ delta }) => {
          if (enabled) {
            gl.autoClear = autoClear;
            composer.value.render(delta);
          }
        },
        priority: enabled ? renderPriority : 0,
      });
    })
  );

  private readonly effectPasses = this.effect<{}>(
    tapEffect(() => {
      let effectPass: EffectPass;
      const defaultCamera = this.store.get((s) => s.camera);
      const { instance: composer, camera, normalPass, depthDownSamplingPass, groupRef } = this.get();

      if (composer.value && groupRef.value && groupRef.value.__ngt__.objects.value.length) {
        effectPass = new EffectPass(
          camera || defaultCamera,
          ...groupRef.value.__ngt__.objects.value.map((ref) => ref.value)
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
  );
}

@NgModule({
  declarations: [NgtEffectComposer, NgtEffectComposerContent],
  exports: [NgtEffectComposer, NgtEffectComposerContent],
  imports: [CommonModule, NgtGroupModule],
})
export class NgtEffectComposerModule {}
