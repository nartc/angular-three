import {
    createParentObjectProvider,
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
    NgtCanvasStore,
    NgtLoop,
    NgtObjectInputsController,
    NgtObjectInputsControllerModule,
    NgtStore,
    tapEffect,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Inject,
    Input,
    NgModule,
    NgZone,
    OnInit,
    Output,
} from '@angular/core';
import { merge, tap } from 'rxjs';
import * as THREE from 'three';
import { TransformControls } from 'three-stdlib';

type ControlsProto = {
    enabled: boolean;
};

interface NgtSobaTransformControlsState {
    controls: TransformControls;
    enabled: boolean;
    object: THREE.Object3D;
    group: THREE.Group;
    camera: THREE.Camera | null;
}

@Component({
    selector: 'ngt-soba-transform-controls',
    template: `
        <ngt-primitive *ngIf="controls" [object]="controls"></ngt-primitive>
        <ngt-group
            *ngIf="!object"
            (ready)="set({ group: $event })"
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
        >
            <ng-container
                *ngIf="group"
                [ngTemplateOutlet]="contentTemplate"
            ></ng-container>
        </ngt-group>
        <ng-template #contentTemplate>
            <ng-content></ng-content>
        </ng-template>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
        createParentObjectProvider(NgtSobaTransformControls, (controls) =>
            controls.get((s) => s.group)
        ),
    ],
})
export class NgtSobaTransformControls
    extends NgtStore<NgtSobaTransformControlsState>
    implements OnInit
{
    @Input() set enabled(enabled: boolean) {
        this.set({ enabled });
    }

    @Input() set object(object: THREE.Object3D) {
        this.set({ object });
    }

    get object() {
        return this.get((s) => s.object);
    }

    @Input() set camera(camera: THREE.Camera) {
        this.set({ camera });
    }

    private attachObjectParams$ = this.select(
        this.select((s) => s.controls),
        merge(
            this.select((s) => s.object),
            this.select((s) => s.group)
        ),
        (controls, object3d) => ({ controls, object3d })
    );

    @Output() ready = this.attachObjectParams$;
    @Output() change = new EventEmitter<THREE.Event>();
    @Output() mousedown = new EventEmitter<THREE.Event>();
    @Output() mouseup = new EventEmitter<THREE.Event>();
    @Output() objectChange = new EventEmitter<THREE.Event>();

    private initControls$ = this.select(
        this.canvasStore.ready$,
        this.select((s) => s.camera),
        (_, camera) => camera
    );

    private draggingParams$ = this.select(
        this.canvasStore.select((s) => s.controls),
        this.select((s) => s.controls),
        (defaultControls, controls) => ({
            defaultControls: defaultControls as unknown as ControlsProto,
            controls,
        })
    );

    constructor(
        private zone: NgZone,
        private canvasStore: NgtCanvasStore,
        private loop: NgtLoop,
        @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
        public objectInputsController: NgtObjectInputsController
    ) {
        super();
        this.set({ enabled: true, camera: null });
    }

    get group() {
        return this.get((s) => s.group);
    }

    get controls() {
        return this.get((s) => s.controls);
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.canvasStore.ready$, () => {
                this.attachObject(this.attachObjectParams$);
                this.init(this.initControls$);
                this.dragging(this.draggingParams$);
                this.setControlsEvent(this.select((s) => s.controls));
            });
        });
    }

    private readonly attachObject = this.effect<{
        controls: TransformControls;
        object3d: THREE.Object3D;
    }>(
        tapEffect(({ controls, object3d }) => {
            controls.attach(object3d);
            return () => {
                controls.detach();
            };
        })
    );

    private readonly init = this.effect<THREE.Camera | null>(
        tap((camera) => {
            const { camera: defaultCamera, renderer } = this.canvasStore.get();
            const controlsCamera: THREE.Camera = camera || defaultCamera;
            this.set({
                controls: new TransformControls(
                    controlsCamera,
                    renderer.domElement
                ),
            });
        })
    );

    private readonly dragging = this.effect<{
        defaultControls: ControlsProto;
        controls: TransformControls;
    }>(
        tapEffect(({ controls, defaultControls }) => {
            if (defaultControls) {
                const callback = (event: THREE.Event) =>
                    (defaultControls.enabled = !event['value']);
                controls.addEventListener('dragging-changed', callback);
                return () => {
                    controls.removeEventListener('dragging-changed', callback);
                };
            }
            return;
        })
    );

    private readonly setControlsEvent = this.effect<TransformControls>(
        tapEffect((controls) => {
            const callback = (e: THREE.Event) => {
                this.loop.invalidate();
                if (this.change.observed) this.change.emit(e);
            };

            controls.addEventListener('change', callback);

            const onMouseDown: ((event: THREE.Event) => void) | undefined = this
                .mousedown.observed
                ? this.mousedown.emit.bind(this.mousedown)
                : undefined;
            const onMouseUp: ((event: THREE.Event) => void) | undefined = this
                .mouseup.observed
                ? this.mouseup.emit.bind(this.mouseup)
                : undefined;
            const onObjectChange: ((event: THREE.Event) => void) | undefined =
                this.objectChange.observed
                    ? this.objectChange.emit.bind(this.objectChange)
                    : undefined;

            if (onMouseDown)
                controls.addEventListener('mouseDown', onMouseDown);
            if (onMouseUp) controls.addEventListener('mouseUp', onMouseUp);
            if (onObjectChange)
                controls.addEventListener('objectChange', onObjectChange);

            return () => {
                controls.removeEventListener('change', callback);
                if (onMouseDown)
                    controls.removeEventListener('mouseDown', onMouseDown);
                if (onMouseUp)
                    controls.removeEventListener('mouseUp', onMouseUp);
                if (onObjectChange)
                    controls.removeEventListener(
                        'objectChange',
                        onObjectChange
                    );
            };
        })
    );
}

@NgModule({
    declarations: [NgtSobaTransformControls],
    exports: [NgtSobaTransformControls, NgtObjectInputsControllerModule],
    imports: [NgtGroupModule, NgtPrimitiveModule, CommonModule],
})
export class NgtSobaTransformControlsModule {}
