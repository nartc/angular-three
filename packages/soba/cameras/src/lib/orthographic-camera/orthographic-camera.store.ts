import {
  CanvasStore,
  distinctKeyMap,
  EnhancedComponentStore,
  NGT_OBJECT_3D_WATCHED_CONTROLLER,
  NgtObject3dController,
  NgtSize,
} from '@angular-three/core';
import { Inject, Injectable, NgZone, SimpleChanges } from '@angular/core';
import { Observable, of, tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';

export interface SobaOrthographicCameraState {
  makeDefault?: boolean;
  manual?: boolean;
  near?: number;
  far?: number;
  orthographicCamera?: THREE.OrthographicCamera;
  oldOrthographicCamera?: THREE.OrthographicCamera;
}

interface UpdateProjectMatrixEffectParams {
  size: NgtSize;
  near: number;
  far: number;
  object3dControllerChanges: SimpleChanges;
}

interface UpdateCameraEffectParams {
  camera: THREE.OrthographicCamera;
  orthographicCamera: THREE.OrthographicCamera;
  makeDefault: boolean;
}

export const initialSobaOrthographicCameraState: SobaOrthographicCameraState = {
  makeDefault: undefined,
  manual: undefined,
  near: undefined,
  far: undefined,
  orthographicCamera: undefined,
  oldOrthographicCamera: undefined,
};

@Injectable()
export class SobaOrthographicCameraStore extends EnhancedComponentStore<SobaOrthographicCameraState> {
  readonly size$ = this.canvasStore.selectors.internal$.pipe(
    distinctKeyMap('size')
  );

  readonly projectMatrixParams$ = this.select(
    this.size$,
    this.selectors.near$,
    this.selectors.far$,
    this.object3dController.change$,
    (size, near, far, object3dControllerChanges) => ({
      size,
      near,
      far,
      object3dControllerChanges,
    }),
    { debounce: true }
  );

  readonly cameraParams$ = this.select(
    this.canvasStore.selectors.camera$,
    this.selectors.orthographicCamera$,
    this.selectors.makeDefault$,
    (camera, orthographicCamera, makeDefault) => ({
      camera,
      orthographicCamera,
      makeDefault,
    }),
    { debounce: true }
  );

  readonly vm$: Observable<{
    left: number;
    right: number;
    top: number;
    bottom: number;
    near?: number;
    far?: number;
    object3dController: NgtObject3dController;
  }> = this.select(
    of(this.object3dController),
    this.size$,
    this.selectors.near$,
    this.selectors.far$,
    (object3dController, size, near, far) => ({
      left: size.width / -2,
      right: size.width / 2,
      top: size.height / 2,
      bottom: size.height / -2,
      object3dController,
      near,
      far,
    }),
    { debounce: true }
  );

  constructor(
    private canvasStore: CanvasStore,
    @Inject(NGT_OBJECT_3D_WATCHED_CONTROLLER)
    private object3dController: NgtObject3dController,
    private ngZone: NgZone
  ) {
    super(initialSobaOrthographicCameraState);
    console.log(this);
  }

  readonly initEffect = this.effect(($) =>
    $.pipe(
      tap(() => {
        this.updateProjectMatrixEffect(
          this
            .projectMatrixParams$ as Observable<UpdateProjectMatrixEffectParams>
        );
        this.updateCameraEffect(
          this.cameraParams$ as Observable<UpdateCameraEffectParams>
        );
      })
    )
  );

  readonly updateProjectMatrixEffect =
    this.effect<UpdateProjectMatrixEffectParams>((params$) =>
      params$.pipe(
        withLatestFrom(
          this.selectors.manual$,
          this.selectors.orthographicCamera$
        ),
        tap(([, manual, orthographicCamera]) => {
          this.ngZone.runOutsideAngular(() => {
            if (orthographicCamera && !manual) {
              orthographicCamera.updateProjectionMatrix();
            }
          });
        })
      )
    );

  readonly updateCameraEffect = this.effect<UpdateCameraEffectParams>(
    (params$) =>
      params$.pipe(
        tap(({ camera, orthographicCamera, makeDefault }) => {
          this.ngZone.runOutsideAngular(() => {
            if (makeDefault && orthographicCamera) {
              this.patchState({ oldOrthographicCamera: camera });
              this.canvasStore.patchState({ camera: orthographicCamera });
            }
          });
        })
      )
  );

  ngOnDestroy() {
    const { oldOrthographicCamera } = this.getImperativeState();
    this.canvasStore.patchState({ camera: oldOrthographicCamera });
    super.ngOnDestroy();
  }
}
