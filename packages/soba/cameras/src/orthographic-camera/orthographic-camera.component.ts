import {
  EnhancedRxState,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtObject3dInputsController,
  NgtObject3dInputsControllerModule,
  NgtSobaExtender,
  NgtStore,
} from '@angular-three/core';
import { NgtOrthographicCameraModule } from '@angular-three/core/cameras';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injectable,
  Input,
  NgModule,
} from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, map, Observable, of, startWith } from 'rxjs';
import * as THREE from 'three';

export interface NgtSobaOrthographicCameraState {
  makeDefault?: boolean;
  manual?: boolean;
  near?: number;
  far?: number;
  orthographicCamera?: THREE.OrthographicCamera;
}

@Injectable()
export class NgtSobaOrthographicCameraStore extends EnhancedRxState<NgtSobaOrthographicCameraState> {
  readonly #projectMatrixParams$ = combineLatest([
    this.store.select('size'),
    this.select(selectSlice(['near', 'far'])),
    this.objectInputsController.change$.pipe(startWith({})),
  ]).pipe(map(([size, { near, far }]) => ({ size, near, far })));

  readonly #cameraParams$ = combineLatest([
    this.store.select('camera'),
    this.select(selectSlice(['orthographicCamera', 'makeDefault'])),
  ]).pipe(
    map(([camera, { orthographicCamera, makeDefault }]) => ({
      camera,
      orthographicCamera,
      makeDefault,
    }))
  );

  readonly vm$: Observable<{
    left: number;
    right: number;
    top: number;
    bottom: number;
    near?: number;
    far?: number;
    objectInputsController: NgtObject3dInputsController;
  }> = combineLatest([
    of(this.objectInputsController),
    this.store.select('size'),
    this.select(
      selectSlice(['near', 'far']),
      startWith({ near: undefined, far: undefined })
    ),
  ]).pipe(
    map(([objectInputsController, size, { near, far }]) => ({
      left: size.width / -2,
      right: size.width / 2,
      top: size.height / 2,
      bottom: size.height / -2,
      objectInputsController,
      near,
      far,
    }))
  );

  constructor(
    private store: NgtStore,
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    private objectInputsController: NgtObject3dInputsController
  ) {
    super();

    this.hold(this.#projectMatrixParams$, () => {
      const { manual, orthographicCamera } = this.get();
      if (orthographicCamera && !manual) {
        orthographicCamera.updateProjectionMatrix();
      }
    });

    this.holdEffect(
      this.#cameraParams$,
      ({ camera, orthographicCamera, makeDefault }) => {
        if (makeDefault && orthographicCamera) {
          this.store.set({ camera: orthographicCamera });
        }

        return () => {
          this.store.set({ camera });
        };
      }
    );
  }
}

@Component({
  selector: 'ngt-soba-orthographic-camera',
  template: `
    <ngt-orthographic-camera
      *ngIf="vm$ | async as vm"
      #ngtOrthographicCamera="ngtOrthographicCamera"
      [args]="[vm.left, vm.right, vm.top, vm.bottom, vm.near, vm.far]"
      [object3dInputsController]="vm.objectInputsController"
      (ready)="object = ngtOrthographicCamera.camera"
    >
      <ng-content></ng-content>
    </ngt-orthographic-camera>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NgtSobaOrthographicCameraStore,
    { provide: NgtSobaExtender, useExisting: NgtSobaOrthographicCamera },
  ],
})
export class NgtSobaOrthographicCamera extends NgtSobaExtender<THREE.OrthographicCamera> {
  @Input() set makeDefault(makeDefault: boolean) {
    this.sobaOrthographicCameraStore.set({ makeDefault });
  }

  @Input() set manual(manual: boolean) {
    this.sobaOrthographicCameraStore.set({ manual });
  }

  @Input() set near(near: number) {
    this.sobaOrthographicCameraStore.set({ near });
  }

  @Input() set far(far: number) {
    this.sobaOrthographicCameraStore.set({ far });
  }

  readonly vm$ = this.sobaOrthographicCameraStore.vm$;

  constructor(
    private sobaOrthographicCameraStore: NgtSobaOrthographicCameraStore
  ) {
    super();
  }
}

@NgModule({
  declarations: [NgtSobaOrthographicCamera],
  exports: [NgtSobaOrthographicCamera, NgtObject3dInputsControllerModule],
  imports: [CommonModule, NgtOrthographicCameraModule],
})
export class NgtSobaOrthographicCameraModule {}
