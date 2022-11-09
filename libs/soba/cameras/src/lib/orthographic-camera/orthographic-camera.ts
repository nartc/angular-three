import {
  AnyConstructor,
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NgtObjectPassThrough,
  NgtRef,
  NumberInput,
  provideCommonCameraRef,
  provideNgtCommonCamera,
  startWithUndefined,
  tapEffect,
} from '@angular-three/core';
import { NgtOrthographicCamera } from '@angular-three/core/cameras';
import { NgtGroup } from '@angular-three/core/objects';
import { NgtSobaFBO } from '@angular-three/soba/misc';
import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  inject,
  Input,
  TemplateRef,
} from '@angular/core';
import { Observable, tap } from 'rxjs';
import * as THREE from 'three';

@Directive({
  selector: 'ng-template[ngt-soba-orthographic-camera-content]',
  standalone: true,
})
export class NgtSobaOrthographicCameraContent {
  readonly templateRef = inject(TemplateRef);

  @Input() set useFBO(value: BooleanInput) {
    this.#useFBO = coerceBooleanProperty(value);
  }
  get useFBO() {
    return this.#useFBO;
  }

  #useFBO = false;

  static ngTemplateContextGuard(
    dir: NgtSobaOrthographicCameraContent,
    ctx: unknown
  ): ctx is { $implicit: NgtRef<THREE.WebGLRenderTarget> } {
    return true;
  }
}

@Component({
  selector: 'ngt-soba-orthographic-camera',
  standalone: true,
  template: `
    <ng-container *ngIf="orthographicCameraVm$ | async as vm">
      <ngt-orthographic-camera
        [ngtObjectPassThrough]="this"
        [args]="[vm.left, vm.right, vm.top, vm.bottom, vm.near, vm.far]"
        #orthographicCamera
      >
        <ng-container
          *ngIf="orthographicContent && !orthographicContent.useFBO"
          [ngTemplateOutlet]="orthographicContent.templateRef"
          [ngTemplateOutletInjector]="orthographicCamera.injector"
        ></ng-container>
      </ngt-orthographic-camera>
    </ng-container>
    <ngt-group
      *ngIf="orthographicContent && orthographicContent.useFBO"
      [ref]="groupRef"
      #group
    >
      <ng-container
        [ngTemplateOutlet]="orthographicContent.templateRef"
        [ngTemplateOutletContext]="{ $implicit: fboRef }"
        [ngTemplateOutletInjector]="group.injector"
      ></ng-container>
    </ngt-group>
  `,

  providers: [
    NgtSobaFBO,
    provideNgtCommonCamera(NgtSobaOrthographicCamera),
    provideCommonCameraRef(NgtSobaOrthographicCamera),
  ],
  imports: [
    NgtOrthographicCamera,
    NgIf,
    NgTemplateOutlet,
    AsyncPipe,
    NgtGroup,
    NgtObjectPassThrough,
  ],
})
export class NgtSobaOrthographicCamera extends NgtOrthographicCamera {
  readonly #sobaFbo = inject(NgtSobaFBO);

  override shouldPassThroughRef = true;
  override isWrapper = true;

  readonly orthographicCameraVm$: Observable<{
    left: number;
    right: number;
    top: number;
    bottom: number;
    near?: number;
    far?: number;
  }> = this.select(
    this.store.select((s) => s.size),
    this.select((s) => s['left']).pipe(startWithUndefined()),
    this.select((s) => s['right']).pipe(startWithUndefined()),
    this.select((s) => s['top']).pipe(startWithUndefined()),
    this.select((s) => s['bottom']).pipe(startWithUndefined()),
    this.select((s) => s['near']).pipe(startWithUndefined()),
    this.select((s) => s['far']).pipe(startWithUndefined()),
    (size, left, right, top, bottom, near, far) => ({
      left: left || size.width / -2,
      right: right || size.width / 2,
      top: top || size.height / 2,
      bottom: bottom || size.height / -2,
      near,
      far,
    }),
    { debounce: true }
  );

  get groupRef(): NgtRef<THREE.Group> {
    return this.get((s) => s['groupRef']);
  }

  get fboRef(): NgtRef<THREE.WebGLRenderTarget> {
    return this.get((s) => s['fboRef']);
  }

  @Input() set makeDefault(makeDefault: BooleanInput) {
    this.set({ makeDefault: coerceBooleanProperty(makeDefault) });
  }

  @Input() set manual(manual: BooleanInput) {
    this.set({ manual: coerceBooleanProperty(manual) });
  }

  @Input() set frames(frames: NumberInput) {
    this.set({ frames: coerceNumberProperty(frames) });
  }

  @Input() set resolution(resolution: NumberInput) {
    this.set({ resolution: coerceNumberProperty(resolution) });
  }

  @Input() set envMap(envMap: THREE.Texture) {
    this.set({ envMap });
  }

  @ContentChild(NgtSobaOrthographicCameraContent)
  orthographicContent?: NgtSobaOrthographicCameraContent;

  override get cameraType(): AnyConstructor<THREE.OrthographicCamera> {
    return THREE.OrthographicCamera;
  }

  readonly #setFbo = this.effect(
    tapEffect(() => {
      const resolution = this.get((s) => s['resolution']);
      this.set({ fboRef: this.#sobaFbo.use(() => ({ width: resolution })) });
    })
  );

  readonly #updateProjectionMatrix = this.effect(
    tap(() => {
      const manual = this.get((s) => s['manual']);
      if (!manual) {
        this.instanceValue.updateProjectionMatrix();
      }
    })
  );

  readonly #makeDefault = this.effect(
    tapEffect(() => {
      const makeDefault = this.get((s) => s['makeDefault']);
      if (makeDefault) {
        const oldCamera = this.store.get((s) => s.camera);
        const oldCameraRef = this.store.get((s) => s.cameraRef);
        this.store.set({
          camera: this.instanceValue,
          cameraRef: this.instance,
        });
        return () => {
          this.store.set({ camera: oldCamera, cameraRef: oldCameraRef });
        };
      }
      return;
    })
  );

  override preInit() {
    super.preInit();
    this.set((s) => ({
      resolution: s['resolution'] ?? 256,
      frames: s['frames'] ?? Infinity,
      makeDefault: s['makeDefault'] ?? false,
      manual: s['manual'] ?? false,
      groupRef: new NgtRef(),
      fboRef: new NgtRef(),
    }));

    this.#setFbo(this.select((s) => s['resolution']));
  }

  override postInit() {
    this.instanceValue.updateProjectionMatrix();
    this.#updateProjectionMatrix(
      this.select(
        this.store.select((s) => s.size),
        this.select((s) => s['manual'])
      )
    );
    this.#makeDefault(
      this.select(
        this.instance,
        this.select((s) => s['makeDefault'])
      )
    );

    if (this.orthographicContent && this.orthographicContent.useFBO) {
      let count = 0;
      let oldEnvMap: THREE.Color | THREE.Texture | null = null;
      this.effect<void>(
        tapEffect(() =>
          this.store.registerBeforeRender({
            callback: (state) => {
              const frames = this.get((s) => s['frames']);
              const envMap = this.get((s) => s['envMap']);
              const groupRef = this.groupRef;
              const fboRef = this.fboRef;
              if (
                groupRef.value &&
                fboRef.value &&
                (frames === Infinity || count < frames)
              ) {
                groupRef.value.visible = false;
                state.gl.setRenderTarget(fboRef.value);
                oldEnvMap = state.scene.background;
                if (envMap) state.scene.background = envMap;
                state.gl.render(state.scene, this.instanceValue);
                state.scene.background = oldEnvMap;
                state.gl.setRenderTarget(null);
                groupRef.value.visible = true;
                count++;
              }
            },
          })
        )
      )();
    }
  }
}
