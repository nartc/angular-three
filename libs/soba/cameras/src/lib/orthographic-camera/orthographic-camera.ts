import {
  createExtenderProvider,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtCanvasStore,
  NgtExtender,
  NgtObjectInputsController,
  NgtObjectInputsControllerModule,
  NgtStore,
  startWithUndefined,
  zonelessRequestAnimationFrame,
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
  makeDefault: boolean;
  manual: boolean;
  near?: number;
  far?: number;
  orthographicCamera?: THREE.OrthographicCamera;
}

@Component({
  selector: 'ngt-soba-orthographic-camera',
  template: `
    <ngt-orthographic-camera
      *ngIf="vm$ | async as vm"
      [args]="vm.cameraArgs"
      [objectInputsController]="vm.objectInputsController"
      (ready)="object = $event"
      (animateReady)="
        animateReady.emit({ entity: object, state: $event.state })
      "
    >
      <ng-content></ng-content>
    </ngt-orthographic-camera>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NgtStore,
    createExtenderProvider(NgtSobaOrthographicCamera),
  ],
})
export class NgtSobaOrthographicCamera extends NgtExtender<THREE.OrthographicCamera> {
  @Input() set makeDefault(makeDefault: boolean) {
    this.store.set({ makeDefault });
  }

  @Input() set manual(manual: boolean) {
    this.store.set({ manual });
  }

  @Input() set near(near: number) {
    this.store.set({ near });
  }

  @Input() set far(far: number) {
    this.store.set({ far });
  }

  private projectMatrixParams$ = combineLatest([
    this.canvasStore.select('size'),
    this.store.select('near').pipe(startWithUndefined()),
    this.store.select('far').pipe(startWithUndefined()),
    this.objectInputsController.changes$.pipe(startWith({})),
  ]);

  private cameraParams$ = combineLatest([
    this.canvasStore.select('camera'),
    this.store.select(selectSlice(['orthographicCamera', 'makeDefault'])),
  ]).pipe(
    map(([camera, { orthographicCamera, makeDefault }]) => ({
      camera,
      orthographicCamera,
      makeDefault,
    }))
  );

  readonly vm$ = combineLatest([
    of(this.objectInputsController),
    this.canvasStore.select('size'),
    this.store.select('near').pipe(startWithUndefined()),
    this.store.select('far').pipe(startWithUndefined()),
  ]).pipe(
    map(([objectInputsController, size, near, far]) => ({
      objectInputsController,
      cameraArgs: [
        size.width / -2,
        size.width / 2,
        size.height / 2,
        size.height / -2,
        near as number,
        far as number,
      ] as ConstructorParameters<typeof THREE.OrthographicCamera>,
    }))
  );

  constructor(
    private canvasStore: NgtCanvasStore,
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    private objectInputsController: NgtObjectInputsController,
    private store: NgtStore<NgtSobaOrthographicCameraState>
  ) {
    super();
    this.store.set({ makeDefault: false, manual: false });
  }

  ngOnInit() {
    zonelessRequestAnimationFrame(() => {
      this.store.hold(this.projectMatrixParams$, () => {
        const { manual, orthographicCamera } = this.store.get();
        if (orthographicCamera && !manual) {
          orthographicCamera.updateProjectionMatrix();
        }
      });

      this.store.effect(
        this.cameraParams$,
        ({ camera, orthographicCamera, makeDefault }) => {
          if (makeDefault && orthographicCamera) {
            this.canvasStore.set({ camera: orthographicCamera });
          }

          return () => {
            this.canvasStore.set({ camera });
          };
        }
      );
    });
  }
}

@NgModule({
  declarations: [NgtSobaOrthographicCamera],
  exports: [NgtSobaOrthographicCamera, NgtObjectInputsControllerModule],
  imports: [CommonModule, NgtOrthographicCameraModule],
})
export class NgtSobaOrthographicCameraModule {}
