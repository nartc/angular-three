import {
  coerceBoolean,
  coerceNumber,
  NgtBooleanInput,
  NgtNumberInput,
  NgtObjectPassThrough,
  NgtRef,
  provideCommonCameraRef,
  provideNgtCommonCamera,
  tapEffect,
} from '@angular-three/core';
import { NgtOrthographicCamera } from '@angular-three/core/cameras';
import { NgtGroup } from '@angular-three/core/objects';
import { NgtSobaFBO } from '@angular-three/soba/misc';
import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, inject, Input } from '@angular/core';
import { Observable, tap } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaCameraContent } from '../camera/camera-content';

@Component({
  selector: 'ngt-soba-orthographic-camera',
  standalone: true,
  template: `
    <ng-container *ngIf="orthographicCameraProps$ | async as props">
      <ngt-orthographic-camera
        shouldPassThroughRef
        [ngtObjectPassThrough]="this"
        [args]="[props.left, props.right, props.top, props.bottom, props.near, props.far]"
      >
        <ng-container
          *ngIf="cameraContent && !cameraContent.useFBO"
          [ngTemplateOutlet]="cameraContent.templateRef"
        ></ng-container>
      </ngt-orthographic-camera>
    </ng-container>
    <ngt-group *ngIf="cameraContent && cameraContent.useFBO" [ref]="groupRef" #group>
      <ng-container
        [ngTemplateOutlet]="cameraContent.templateRef"
        [ngTemplateOutletContext]="{ $implicit: fboRef, group }"
      ></ng-container>
    </ngt-group>
  `,

  providers: [
    NgtSobaFBO,
    provideNgtCommonCamera(NgtSobaOrthographicCamera),
    provideCommonCameraRef(NgtSobaOrthographicCamera),
  ],
  imports: [NgtOrthographicCamera, NgIf, NgTemplateOutlet, NgtGroup, NgtObjectPassThrough, AsyncPipe],
})
export class NgtSobaOrthographicCamera extends NgtOrthographicCamera {
  private readonly sobaFbo = inject(NgtSobaFBO);

  override isWrapper = true;

  readonly orthographicCameraProps$: Observable<{
    left: number;
    right: number;
    top: number;
    bottom: number;
    near?: number;
    far?: number;
  }> = this.select(
    this.store.select((s) => s.size),
    this.select((s) => s['left']),
    this.select((s) => s['right']),
    this.select((s) => s['top']),
    this.select((s) => s['bottom']),
    this.select((s) => s['near']),
    this.select((s) => s['far']),
    (size, left, right, top, bottom, near, far) => {
      return {
        left: left || size.width / -2,
        right: right || size.width / 2,
        top: top || size.height / 2,
        bottom: bottom || size.height / -2,
        near,
        far,
      };
    },
    { debounce: true }
  );

  get groupRef(): NgtRef<THREE.Group> {
    return this.getState((s) => s['groupRef']);
  }

  get fboRef(): NgtRef<THREE.WebGLRenderTarget> {
    return this.getState((s) => s['fboRef']);
  }

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
}
