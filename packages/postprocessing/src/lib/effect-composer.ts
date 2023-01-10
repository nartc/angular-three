import {
  createInjectionToken,
  extend,
  getLocalState,
  injectNgtRef,
  injectNgtStore,
  NgtRef,
  NgtRxStore,
  startWithUndefined,
} from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit } from '@angular/core';
import { RxActionFactory } from '@rx-angular/state/actions';
import {
  DepthDownsamplingPass,
  EffectComposer,
  EffectPass,
  NormalPass,
  RenderPass,
} from 'postprocessing';
import { combineLatest, map } from 'rxjs';
import { Camera, Group, HalfFloatType, Scene, TextureDataType } from 'three';
import { isWebGL2Available } from 'three-stdlib';

extend({ Group });

interface NgtpEffectComposerApi {
  composer: EffectComposer;
  normalPass: NormalPass | null;
  downSamplingPass: DepthDownsamplingPass | null;
  scene: Scene;
  camera: Camera;
  resolutionScale?: number;
  select: NgtpEffectComposer['select'];
}

export const [injectNgtpEffectComposertApi, provideNgtpEffectComposerApi] =
  createInjectionToken<NgtpEffectComposerApi>('NgtpEffectComposert public API');

function effectComposerApiFactory(composer: NgtpEffectComposer) {
  const api = {} as NgtpEffectComposerApi;

  Object.defineProperties(api, {
    composer: { get: () => composer.get('entities')[0] },
    normalPass: { get: () => composer.get('entities')[1] },
    downSamplingPass: { get: () => composer.get('entities')[2] },
    resolutionScale: { get: () => composer.get('resolutionScale') },
    scene: { get: () => composer.get('activeScene') },
    camera: { get: () => composer.get('activeCamera') },
    select: { get: () => composer.select.bind(composer) },
  });

  return api;
}

@Component({
  selector: 'ngtp-effect-composer',
  standalone: true,
  template: `
    <ngt-group *ref="groupRef">
      <ng-content />
    </ngt-group>
  `,
  imports: [NgtRef],
  providers: [
    provideNgtpEffectComposerApi([NgtpEffectComposer], effectComposerApiFactory),
    RxActionFactory,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtpEffectComposer extends NgtRxStore implements OnInit {
  readonly #store = injectNgtStore();
  readonly #actions = inject(RxActionFactory<{ setBeforeRender: void }>).create();

  @Input() groupRef = injectNgtRef<Group>();

  @Input() set enabled(enabled: boolean) {
    this.set({ enabled });
  }

  @Input() set depthBuffer(depthBuffer: boolean) {
    this.set({ depthBuffer });
  }

  @Input() set disableNormalPass(disableNormalPass: boolean) {
    this.set({ disableNormalPass });
  }

  @Input() set stencilBuffer(stencilBuffer: boolean) {
    this.set({ stencilBuffer });
  }

  @Input() set autoClear(autoClear: boolean) {
    this.set({ autoClear });
  }

  @Input() set resolutionScale(resolutionScale: number) {
    this.set({ resolutionScale });
  }

  @Input() set multisampling(multisampling: number) {
    this.set({ multisampling });
  }

  @Input() set frameBufferType(frameBufferType: TextureDataType) {
    this.set({ frameBufferType });
  }

  @Input() set renderPriority(renderPriority: number) {
    this.set({ renderPriority });
  }

  @Input() set camera(camera: Camera) {
    this.set({ camera });
  }

  @Input() set scene(scene: Scene) {
    this.set({ scene });
  }

  override initialize(): void {
    super.initialize();
    this.set({
      enabled: true,
      renderPriority: 1,
      autoClear: true,
      multisampling: 8,
      frameBufferType: HalfFloatType,
    });
  }

  ngOnInit() {
    this.connect(
      'activeScene',
      combineLatest([
        this.select('scene').pipe(startWithUndefined()),
        this.#store.select('scene'),
      ]).pipe(map(([scene, defaultScene]) => scene || defaultScene))
    );
    this.connect(
      'activeCamera',
      combineLatest([
        this.select('camera').pipe(startWithUndefined()),
        this.#store.select('camera'),
      ]).pipe(map(([camera, defaultCamera]) => camera || defaultCamera))
    );

    this.connect(
      'entities',
      combineLatest([
        this.#store.select('gl'),
        this.select('activeScene'),
        this.select('activeCamera'),
        this.select('multisampling'),
        this.select('frameBufferType'),
        this.select('depthBuffer').pipe(startWithUndefined()),
        this.select('stencilBuffer').pipe(startWithUndefined()),
        this.select('disableNormalPass').pipe(startWithUndefined()),
        this.select('resolutionScale').pipe(startWithUndefined()),
      ]).pipe(
        map(
          ([
            gl,
            scene,
            camera,
            multisampling,
            frameBufferType,
            depthBuffer,
            stencilBuffer,
            disableNormalPass,
            resolutionScale,
          ]) => {
            const webGL2Available = isWebGL2Available();
            // Initialize composer
            const effectComposer = new EffectComposer(gl, {
              depthBuffer,
              stencilBuffer,
              multisampling: multisampling > 0 && webGL2Available ? multisampling : 0,
              frameBufferType,
            });

            // Add render pass
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

            return [effectComposer, normalPass, downSamplingPass];
          }
        )
      )
    );
    this.#setComposerSize();
    this.#setEffectPasses();
    this.#setBeforeRender();
  }

  #setBeforeRender() {
    const { enabled, renderPriority } = this.get();
    this.effect(this.#actions.setBeforeRender$, () =>
      this.#store.get('internal').subscribe(
        ({ delta }) => {
          const [composer] = this.get('entities') || [];
          const { enabled, autoClear } = this.get();
          const gl = this.#store.get('gl');
          if (composer && enabled) {
            gl.autoClear = autoClear;
            composer.render(delta);
          }
        },
        enabled ? renderPriority : 0
      )
    );
    this.#actions.setBeforeRender();
  }

  #setComposerSize() {
    this.hold(
      combineLatest([this.select('entities'), this.#store.select('size')]),
      ([[composer], size]) => void (composer as EffectComposer)?.setSize(size.width, size.height)
    );
  }

  #setEffectPasses() {
    this.effect(
      combineLatest([
        this.select('entities'),
        this.select('activeCamera'),
        this.groupRef.children$('nonObjects'),
      ]),
      ([[composer, normalPass, downSamplingPass], camera, effects]) => {
        let effectPass: EffectPass;
        if (this.groupRef.nativeElement && getLocalState(this.groupRef.nativeElement) && composer) {
          effectPass = new EffectPass(camera, ...effects);
          effectPass.renderToScreen = true;
          composer.addPass(effectPass);
          if (normalPass) normalPass.enabled = true;
          if (downSamplingPass) downSamplingPass.enabled = true;
        }
        return () => {
          if (effectPass) composer?.removePass(effectPass);
          if (normalPass) normalPass.enabled = false;
          if (downSamplingPass) downSamplingPass.enabled = false;
        };
      }
    );
  }
}
