import {
  coerceBoolean,
  coerceNumber,
  NgtBooleanInput,
  NgtNumberInput,
  NgtObjectPassThrough,
  NgtRef,
  provideCommonCameraRef,
  provideNgtCommonCamera,
  provideObjectHostRef,
  tapEffect,
} from '@angular-three/core';
import { NgtPerspectiveCamera } from '@angular-three/core/cameras';
import { NgtGroup } from '@angular-three/core/objects';
import { NgtSobaFBO } from '@angular-three/soba/misc';
import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, inject, Input } from '@angular/core';
import { Observable, tap } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaCameraContent } from '../camera/camera-content';

@Component({
  selector: 'ngt-soba-perspective-camera',
  standalone: true,
  template: `
    <ng-container *ngIf="perspectiveCameraProps$ | async as props">
      <ngt-perspective-camera
        shouldPassThroughRef
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
  imports: [NgtPerspectiveCamera, NgtObjectPassThrough, NgIf, NgTemplateOutlet, NgtGroup, AsyncPipe],
})
export class NgtSobaPerspectiveCamera extends NgtPerspectiveCamera {
  private readonly sobaFbo = inject(NgtSobaFBO);

  override isWrapper = true;

  @Input() set makeDefault(makeDefault: NgtBooleanInput) {
    this.set({ makeDefault: coerceBoolean(makeDefault) });
  }

  @Input() set manual(manual: NgtBooleanInput) {
    this.set({ manual: coerceBoolean(manual) });
  }

  @Input() set frames(frames: NgtNumberInput) {
    this.set({ frames: coerceNumber(frames) });
  }

  @Input() set resolution(resolution: NgtNumberInput) {
    this.set({ resolution: coerceNumber(resolution) });
  }

  @Input() set envMap(envMap: THREE.Texture) {
    this.set({ envMap });
  }

  @ContentChild(NgtSobaCameraContent)
  cameraContent?: NgtSobaCameraContent;

  get groupRef(): NgtRef<THREE.Group> {
    return this.getState((s) => s['groupRef']);
  }

  get fboRef(): NgtRef<THREE.WebGLRenderTarget> {
    return this.getState((s) => s['fboRef']);
  }

  readonly perspectiveCameraProps$: Observable<{
    fov?: number;
    aspect: number;
    near?: number;
    far?: number;
  }> = this.select(
    this.store.select((s) => s.size),
    this.select((s) => s['fov']),
    this.select((s) => s['aspect']),
    this.select((s) => s['near']),
    this.select((s) => s['far']),
    (size, fov, aspect, near, far) => ({
      fov,
      aspect: aspect || size.width / size.height,
      near,
      far,
    }),
    { debounce: true }
  );

  override setOptionsTrigger$ = this.select(
    this.select((s) => s['manual']),
    this.store.select((s) => s.size),
    this.defaultProjector
  );

  private readonly setFbo = this.effect(
    tap(() => {
      const resolution = this.getState((s) => s['resolution']);
      this.set({
        fboRef: this.sobaFbo.use(() => ({ width: resolution })),
      });
    })
  );

  private readonly updateProjectionMatrix = this.effect(
    tap(() => {
      const manual = this.getState((s) => s['manual']);
      if (!manual) {
        this.instanceValue.updateProjectionMatrix();
      }
    })
  );

  private readonly updateMakeDefault = this.effect(
    tapEffect(() => {
      const makeDefault = this.getState((s) => s['makeDefault']);
      if (makeDefault) {
        const oldCamera = this.store.getState((s) => s.camera);
        const oldCameraRef = this.store.getState((s) => s.cameraRef);
        this.store.set({
          camera: this.instanceValue,
          cameraRef: this.instanceRef as NgtRef,
        });
        return () => {
          this.store.set({ camera: oldCamera, cameraRef: oldCameraRef });
        };
      }
    })
  );

  override initialize() {
    super.initialize();
    this.set({
      resolution: 256,
      frames: Infinity,
      makeDefault: false,
      manual: false,
      groupRef: new NgtRef(),
      fboRef: new NgtRef(),
    });
  }

  override postInit() {
    super.postInit();
    this.setFbo(this.select((s) => s['resolution']));
    this.instanceValue.updateProjectionMatrix();
    this.updateProjectionMatrix(
      this.select(
        this.store.select((s) => s.size),
        this.select((s) => s['manual']),
        this.defaultProjector
      )
    );
    this.updateMakeDefault(
      this.select(
        this.instanceRef,
        this.select((s) => s['makeDefault']),
        this.defaultProjector
      )
    );

    if (this.cameraContent && this.cameraContent.useFBO) {
      let count = 0;
      let oldEnvMap: THREE.Color | THREE.Texture | null = null;
      this.effect<void>(
        tapEffect(() =>
          this.store.registerBeforeRender({
            callback: (state) => {
              const frames = this.getState((s) => s['frames']);
              const envMap = this.getState((s) => s['envMap']);
              const groupRef = this.groupRef;
              const fboRef = this.fboRef;
              if (groupRef.value && fboRef.value && (frames === Infinity || count < frames)) {
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
    const manual = this.getState((s) => s['manual']);
    const size = this.store.getState((s) => s.size);
    if (!manual) {
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
    }
  }
}
