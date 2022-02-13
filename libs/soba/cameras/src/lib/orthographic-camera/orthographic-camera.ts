import {
    AnyFunction,
    createExtenderProvider,
    createHostParentObjectProvider,
    createParentObjectProvider,
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
    NGT_PARENT_OBJECT,
    NgtCamera,
    NgtCanvasStore,
    NgtExtender,
    NgtObjectInputsController,
    NgtObjectInputsControllerModule,
    NgtSize,
    NgtStore,
    startWithUndefined,
    tapEffect,
} from '@angular-three/core';
import { NgtOrthographicCameraModule } from '@angular-three/core/cameras';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    NgModule,
    NgZone,
    Optional,
    SimpleChanges,
    SkipSelf,
} from '@angular/core';
import { startWith, tap } from 'rxjs';
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
            [args]="(cameraArgs$ | async)!"
            [name]="objectInputsController.name"
            [position]="objectInputsController.position"
            [rotation]="objectInputsController.rotation"
            [quaternion]="objectInputsController.quaternion"
            [scale]="objectInputsController.scale"
            [color]="objectInputsController.color"
            [userData]="objectInputsController.userData"
            [castShadow]="objectInputsController.castShadow"
            [receiveShadow]="objectInputsController.receiveShadow"
            [visible]="objectInputsController.visible"
            [matrixAutoUpdate]="objectInputsController.matrixAutoUpdate"
            [dispose]="objectInputsController.dispose"
            [raycast]="objectInputsController.raycast"
            [appendMode]="objectInputsController.appendMode"
            [appendTo]="objectInputsController.appendTo"
            (click)="objectInputsController.click.emit($event)"
            (contextmenu)="objectInputsController.contextmenu.emit($event)"
            (dblclick)="objectInputsController.dblclick.emit($event)"
            (pointerup)="objectInputsController.pointerup.emit($event)"
            (pointerdown)="objectInputsController.pointerdown.emit($event)"
            (pointerover)="objectInputsController.pointerover.emit($event)"
            (pointerout)="objectInputsController.pointerout.emit($event)"
            (pointerenter)="objectInputsController.pointerenter.emit($event)"
            (pointerleave)="objectInputsController.pointerleave.emit($event)"
            (pointermove)="objectInputsController.pointermove.emit($event)"
            (pointermissed)="objectInputsController.pointermissed.emit($event)"
            (pointercancel)="objectInputsController.pointercancel.emit($event)"
            (wheel)="objectInputsController.wheel.emit($event)"
            (ready)="object = $event"
            (animateReady)="
                animateReady.emit({ entity: object, state: $event.state })
            "
        >
            <ng-container
                *ngIf="object"
                [ngTemplateOutlet]="contentTemplate"
            ></ng-container>
        </ngt-orthographic-camera>
        <ng-template #contentTemplate>
            <ng-content></ng-content>
        </ng-template>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
        NgtStore,
        createExtenderProvider(NgtSobaOrthographicCamera),
        createParentObjectProvider(
            NgtSobaOrthographicCamera,
            (camera) => camera.object
        ),
        createHostParentObjectProvider(NgtSobaOrthographicCamera),
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

    private projectMatrixParams$ = this.store.select(
        this.canvasStore.select((s) => s.size),
        this.store.select((s) => s.near).pipe(startWithUndefined()),
        this.store.select((s) => s.far).pipe(startWithUndefined()),
        this.objectInputsController.changes$.pipe(startWith({})),
        (size, near, far, changes) => ({ size, near, far, changes })
    );

    private cameraParams$ = this.store.select(
        this.canvasStore.select((s) => s.camera),
        this.store.select((s) => s.orthographicCamera),
        this.store.select((s) => s.makeDefault),
        (camera, orthographicCamera, makeDefault) => ({
            camera,
            orthographicCamera,
            makeDefault,
        })
    );

    readonly cameraArgs$ = this.store.select(
        this.canvasStore.select((s) => s.size),
        this.store.select((s) => s.near).pipe(startWithUndefined()),
        this.store.select((s) => s.far).pipe(startWithUndefined()),
        (size, near, far) =>
            [
                size.width / -2,
                size.width / 2,
                size.height / 2,
                size.height / -2,
                near as number,
                far as number,
            ] as ConstructorParameters<typeof THREE.OrthographicCamera>
    );

    constructor(
        private zone: NgZone,
        private canvasStore: NgtCanvasStore,
        @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
        public objectInputsController: NgtObjectInputsController,
        private store: NgtStore<NgtSobaOrthographicCameraState>,
        @Optional()
        @SkipSelf()
        @Inject(NGT_PARENT_OBJECT)
        public parentObjectFn: AnyFunction
    ) {
        super();
        this.store.set({ makeDefault: false, manual: false });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.store.onCanvasReady(this.canvasStore.ready$, () => {
                this.updateProjectMatrix(this.projectMatrixParams$);
                this.setCamera(this.cameraParams$);
            });
        });
    }

    private readonly updateProjectMatrix = this.store.effect<{
        size: NgtSize;
        near: number | undefined;
        far: number | undefined;
        changes: SimpleChanges;
    }>(
        tap(() => {
            const { manual, orthographicCamera } = this.store.get();
            if (orthographicCamera && !manual) {
                orthographicCamera.updateProjectionMatrix();
            }
        })
    );

    private readonly setCamera = this.store.effect<{
        camera: NgtCamera;
        orthographicCamera: THREE.OrthographicCamera | undefined;
        makeDefault: boolean;
    }>(
        tapEffect(({ camera, orthographicCamera, makeDefault }) => {
            if (makeDefault && orthographicCamera) {
                this.canvasStore.set({ camera: orthographicCamera });
            }

            return () => {
                this.canvasStore.set({ camera });
            };
        })
    );
}

@NgModule({
    declarations: [NgtSobaOrthographicCamera],
    exports: [NgtSobaOrthographicCamera, NgtObjectInputsControllerModule],
    imports: [CommonModule, NgtOrthographicCameraModule],
})
export class NgtSobaOrthographicCameraModule {}
