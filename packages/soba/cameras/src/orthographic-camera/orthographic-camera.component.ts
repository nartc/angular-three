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
  Input,
  NgModule,
} from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, map, of, startWith } from 'rxjs';
import * as THREE from 'three';

export interface NgtSobaOrthographicCameraState {
  makeDefault?: boolean;
  manual?: boolean;
  near?: number;
  far?: number;
  orthographicCamera?: THREE.OrthographicCamera;
}

@Component({
  selector: 'ngt-soba-orthographic-camera',
  template: `
    <ngt-orthographic-camera
      *ngIf="vm$ | async as vm"
      [args]="[vm.left, vm.right, vm.top, vm.bottom, vm.near, vm.far]"
      [object3dInputsController]="vm.objectInputsController"
      (ready)="object = $event"
    >
      <ng-content></ng-content>
    </ngt-orthographic-camera>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    EnhancedRxState,
    { provide: NgtSobaExtender, useExisting: NgtSobaOrthographicCamera },
  ],
})
export class NgtSobaOrthographicCamera extends NgtSobaExtender<THREE.OrthographicCamera> {
  @Input() set makeDefault(makeDefault: boolean) {
    this.state.set({ makeDefault });
  }

  @Input() set manual(manual: boolean) {
    this.state.set({ manual });
  }

  @Input() set near(near: number) {
    this.state.set({ near });
  }

  @Input() set far(far: number) {
    this.state.set({ far });
  }

  readonly #projectMatrixParams$ = combineLatest([
    this.store.select('size'),
    this.state.select(selectSlice(['near', 'far'])),
    this.objectInputsController.change$.pipe(startWith({})),
  ]).pipe(map(([size, { near, far }]) => ({ size, near, far })));

  readonly #cameraParams$ = combineLatest([
    this.store.select('camera'),
    this.state.select(selectSlice(['orthographicCamera', 'makeDefault'])),
  ]).pipe(
    map(([camera, { orthographicCamera, makeDefault }]) => ({
      camera,
      orthographicCamera,
      makeDefault,
    }))
  );

  readonly vm$ = combineLatest([
    of(this.objectInputsController),
    this.store.select('size'),
    this.state.select(
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
    private objectInputsController: NgtObject3dInputsController,
    private state: EnhancedRxState<NgtSobaOrthographicCameraState>
  ) {
    super();

    state.hold(this.#projectMatrixParams$, () => {
      const { manual, orthographicCamera } = state.get();
      if (orthographicCamera && !manual) {
        orthographicCamera.updateProjectionMatrix();
      }
    });

    state.holdEffect(
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

@NgModule({
  declarations: [NgtSobaOrthographicCamera],
  exports: [NgtSobaOrthographicCamera, NgtObject3dInputsControllerModule],
  imports: [CommonModule, NgtOrthographicCameraModule],
})
export class NgtSobaOrthographicCameraModule {}
