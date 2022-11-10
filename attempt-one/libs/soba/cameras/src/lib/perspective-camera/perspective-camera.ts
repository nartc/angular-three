import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NgtObjectPassThrough,
  NgtRef,
  NumberInput,
  provideCommonCameraRef,
  provideNgtCommonCamera,
  provideObjectHostRef,
  startWithUndefined,
  tapEffect,
} from '@angular-three/core';
import { NgtPerspectiveCamera } from '@angular-three/core/cameras';
import { NgtGroup } from '@angular-three/core/objects';
import { NgtSobaFBO } from '@angular-three/soba/misc';
import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, inject, Input } from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaCameraContent } from '../camera/camera-content';

@Component({
  selector: 'ngt-soba-perspective-camera',
  standalone: true,
  template: `
    <ng-container *ngIf="perspectiveCameraProps$ | async as props">
      <ngt-perspective-camera
        [ngtObjectPassThrough]="this"
        [args]="[props.fov, props.aspect, props.near, props.far]"
      >
        <ng-container
          *ngIf="cameraContent && !cameraContent.useFBO"
          [ngTemplateOutlet]="cameraContent.templateRef"
        ></ng-container>
      </ngt-perspective-camera>
      <ngt-group [ref]="groupRef" #group skipWrapper>
        <ng-container
          *ngIf="cameraContent && cameraContent.useFBO"
          [ngTemplateOutlet]="cameraContent.templateRef"
          [ngTemplateOutletContext]="{ $implicit: fboRef, group }"
        ></ng-container>
      </ngt-group>
    </ng-container>
  `,
  providers: [
    NgtSobaFBO,
    provideNgtCommonCamera(NgtSobaPerspectiveCamera),
    provideCommonCameraRef(NgtSobaPerspectiveCamera),
    provideObjectHostRef(NgtSobaPerspectiveCamera),
  ],
  imports: [
    NgtPerspectiveCamera,
    NgtObjectPassThrough,
    NgIf,
    AsyncPipe,
    NgTemplateOutlet,
    NgtGroup,
  ],
})
export class NgtSobaPerspectiveCamera extends NgtPerspectiveCamera {
  readonly #sobaFbo = inject(NgtSobaFBO);

  override isWrapper = true;
  override shouldPassThroughRef = true;

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

  @ContentChild(NgtSobaCameraContent)
  cameraContent?: NgtSobaCameraContent;

  get groupRef(): NgtRef<THREE.Group> {
    return this.get((s) => s['groupRef']);
  }

  get fboRef(): NgtRef<THREE.WebGLRenderTarget> {
    return this.get((s) => s['fboRef']);
  }

  readonly perspectiveCameraProps$ = this.select(
    this.store.select((s) => s.size),
    this.select((s) => s['fov']).pipe(startWithUndefined()),
    this.select((s) => s['aspect']).pipe(startWithUndefined()),
    this.select((s) => s['near']).pipe(startWithUndefined()),
    this.select((s) => s['far']).pipe(startWithUndefined()),
    (size, fov, aspect, near, far) => ({
      fov,
      aspect: aspect || size.width / size.height,
      near,
      far,
    }),
    { debounce: true }
  );

  override setOptionsTrigger$ = this.select(
    this.select((s) => s['manual']).pipe(startWithUndefined()),
    this.store.select((s) => s.size)
  );

  readonly #setFbo = this.effect(
    tap(() => {
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

    if (this.cameraContent && this.cameraContent.useFBO) {
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

  override postSetOptions(camera: THREE.PerspectiveCamera) {
    super.postSetOptions(camera);
    const manual = this.get((s) => s['manual']);
    const size = this.store.get((s) => s.size);
    if (!manual) {
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
    }
  }
}
