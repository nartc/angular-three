import {
    AnyFunction,
    createExtenderProvider,
    createHostParentObjectProvider,
    createParentObjectProvider,
    is,
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
    NGT_PARENT_OBJECT,
    NgtAnimationFrameStore,
    NgtCanvasStore,
    NgtExtender,
    NgtLoop,
    NgtObjectInputsController,
    NgtObjectInputsControllerModule,
    NgtStore,
    tapEffect,
} from '@angular-three/core';
import { NgtGroupModule } from '@angular-three/core/group';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Injectable,
    Input,
    NgModule,
    NgZone,
    OnInit,
    Optional,
    SkipSelf,
} from '@angular/core';
import { Observable } from 'rxjs';
import * as THREE from 'three';

type ControlsProto = {
    update(): void;
    target: THREE.Vector3;
    maxDistance: number;
    addEventListener: (
        event: string,
        callback: (event: unknown) => void
    ) => void;
    removeEventListener: (
        event: string,
        callback: (event: unknown) => void
    ) => void;
};

export type SizeProps = {
    box: THREE.Box3;
    size: THREE.Vector3;
    center: THREE.Vector3;
    distance: number;
};

export interface NgtSobaBoundsState {
    group: THREE.Group;
    damping: number;
    margin: number;
    eps: number;
    fit: boolean;
    clip: boolean;
}

@Injectable()
export class NgtSobaBoundsContext {
    get goalZoom(): number {
        return this._goalZoom;
    }

    get goalCamera(): THREE.Vector3 {
        return this._goalCamera;
    }

    get goalFocus(): THREE.Vector3 {
        return this._goalFocus;
    }

    get currentZoom(): number {
        return this._currentZoom;
    }

    set currentZoom(value: number) {
        this._currentZoom = value;
    }

    get currentCamera(): THREE.Vector3 {
        return this._currentCamera;
    }

    get currentFocus(): THREE.Vector3 {
        return this._currentFocus;
    }

    get currentAnimating(): boolean {
        return this._currentAnimating;
    }

    set currentAnimating(value: boolean) {
        this._currentAnimating = value;
    }

    private _currentAnimating = false;
    private _currentFocus = new THREE.Vector3();
    private _currentCamera = new THREE.Vector3();
    private _currentZoom = 1;

    private _goalFocus = new THREE.Vector3();
    private _goalCamera = new THREE.Vector3();
    private _goalZoom = 1;

    private box = new THREE.Box3();

    constructor(
        private canvasStore: NgtCanvasStore,
        private boundsStore: NgtStore<NgtSobaBoundsState>,
        private loop: NgtLoop
    ) {}

    getSize(): SizeProps {
        const camera = this.canvasStore.get((s) => s.camera);
        const size = this.box.getSize(new THREE.Vector3());
        const center = this.box.getCenter(new THREE.Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        const fitHeightDistance = is.orthographic(camera)
            ? maxSize * 4
            : maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
        const fitWidthDistance = is.orthographic(camera)
            ? maxSize * 4
            : fitHeightDistance / camera.aspect;
        const distance =
            this.boundsStore.get((s) => s.margin) *
            Math.max(fitHeightDistance, fitWidthDistance);
        return { box: this.box, size, center, distance };
    }

    refresh(object?: THREE.Object3D | THREE.Box3) {
        const group = this.boundsStore.get((s) => s.group);
        const camera = this.canvasStore.get((s) => s.camera);
        const controls = this.canvasStore.get(
            (s) => s.controls
        ) as unknown as ControlsProto;
        if (NgtSobaBoundsContext.isObject3D(object))
            this.box.setFromObject(object);
        else if (NgtSobaBoundsContext.isBox3(object)) this.box.copy(object);
        else if (group) this.box.setFromObject(group);

        if (this.box.isEmpty()) {
            const max = camera.position.length() || 10;
            this.box.setFromCenterAndSize(
                new THREE.Vector3(),
                new THREE.Vector3(max, max, max)
            );
        }

        if (controls?.constructor.name === 'OrthographicTrackballControls') {
            const { distance } = this.getSize();
            const direction = camera.position
                .clone()
                .sub(controls.target)
                .normalize()
                .multiplyScalar(distance);
            const newPos = controls.target.clone().add(direction);
            camera.position.copy(newPos);
        }

        return this;
    }

    clip() {
        const camera = this.canvasStore.get((s) => s.camera);
        const controls = this.canvasStore.get(
            (s) => s.controls
        ) as unknown as ControlsProto;
        const { distance } = this.getSize();
        if (controls) controls.maxDistance = distance * 10;
        camera.near = distance / 100;
        camera.far = distance * 100;
        camera.updateProjectionMatrix();
        if (controls) controls.update();
        return this;
    }

    fit() {
        const { margin, damping } = this.boundsStore.get();
        const camera = this.canvasStore.get((s) => s.camera);
        const controls = this.canvasStore.get(
            (s) => s.controls
        ) as unknown as ControlsProto;
        this._currentCamera.copy(camera.position);
        if (controls) this._currentFocus.copy(controls.target);

        const { center, distance } = this.getSize();
        const direction = center
            .clone()
            .sub(camera.position)
            .normalize()
            .multiplyScalar(distance);

        this._goalCamera.copy(center).sub(direction);
        this._goalFocus.copy(center);

        if (is.orthographic(camera)) {
            this._currentZoom = camera.zoom;

            let maxHeight = 0,
                maxWidth = 0;
            const vertices = [
                new THREE.Vector3(
                    this.box.min.x,
                    this.box.min.y,
                    this.box.min.z
                ),
                new THREE.Vector3(
                    this.box.min.x,
                    this.box.max.y,
                    this.box.min.z
                ),
                new THREE.Vector3(
                    this.box.min.x,
                    this.box.min.y,
                    this.box.max.z
                ),
                new THREE.Vector3(
                    this.box.min.x,
                    this.box.max.y,
                    this.box.max.z
                ),
                new THREE.Vector3(
                    this.box.max.x,
                    this.box.max.y,
                    this.box.max.z
                ),
                new THREE.Vector3(
                    this.box.max.x,
                    this.box.max.y,
                    this.box.min.z
                ),
                new THREE.Vector3(
                    this.box.max.x,
                    this.box.min.y,
                    this.box.max.z
                ),
                new THREE.Vector3(
                    this.box.max.x,
                    this.box.min.y,
                    this.box.min.z
                ),
            ];
            // Transform the center and each corner to camera space
            center.applyMatrix4(camera.matrixWorldInverse);
            for (const v of vertices) {
                v.applyMatrix4(camera.matrixWorldInverse);
                maxHeight = Math.max(maxHeight, Math.abs(v.y - center.y));
                maxWidth = Math.max(maxWidth, Math.abs(v.x - center.x));
            }
            maxHeight *= 2;
            maxWidth *= 2;
            const zoomForHeight = (camera.top - camera.bottom) / maxHeight;
            const zoomForWidth = (camera.right - camera.left) / maxWidth;
            this._goalZoom = Math.min(zoomForHeight, zoomForWidth) / margin;
            if (!damping) {
                camera.zoom = this._goalZoom;
                camera.updateProjectionMatrix();
            }
        }

        if (damping) {
            this._currentAnimating = true;
        } else {
            camera.position.copy(this._goalCamera);
            camera.lookAt(this._goalFocus);
            if (controls) {
                controls.target.copy(this._goalFocus);
                controls.update();
            }
            this.loop.invalidate();
        }
        // if (onFitRef.current) onFitRef.current(this.getSize());
        return this;
    }

    private static isObject3D(object: unknown): object is THREE.Object3D {
        return !!object && (object as THREE.Object3D).isObject3D;
    }

    private static isBox3(object: unknown): object is THREE.Box3 {
        return !!object && (object as THREE.Box3).isBox3;
    }
}

@Component({
    selector: 'ngt-soba-bounds',
    template: `
        <ngt-group
            (ready)="object = $event; store.set({ group: $event })"
            (animateReady)="
                animateReady.emit({ entity: object, state: $event.state })
            "
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
                *ngIf="object"
                [ngTemplateOutlet]="contentTemplate"
            ></ng-container>
        </ngt-group>
        <ng-template #contentTemplate>
            <ng-content></ng-content>
        </ng-template>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        NgtStore,
        NgtSobaBoundsContext,
        NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
        createExtenderProvider(NgtSobaBounds),
        createParentObjectProvider(NgtSobaBounds, (bounds) =>
            bounds.store.get((s) => s.group)
        ),
        createHostParentObjectProvider(NgtSobaBounds),
    ],
})
export class NgtSobaBounds extends NgtExtender<THREE.Group> implements OnInit {
    @Input() set damping(damping: number) {
        this.store.set({ damping });
    }

    @Input() set fit(fit: boolean) {
        this.store.set({ fit });
    }

    @Input() set clip(clip: boolean) {
        this.store.set({ clip });
    }

    @Input() set margin(margin: number) {
        this.store.set({ margin });
    }

    @Input() set eps(eps: number) {
        this.store.set({ eps });
    }

    constructor(
        public store: NgtStore<NgtSobaBoundsState>,
        @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
        public objectInputsController: NgtObjectInputsController,
        private canvasStore: NgtCanvasStore,
        private loop: NgtLoop,
        private animationFrameStore: NgtAnimationFrameStore,
        private context: NgtSobaBoundsContext,
        private zone: NgZone,
        @Optional()
        @SkipSelf()
        @Inject(NGT_PARENT_OBJECT)
        public parentObjectFn: AnyFunction
    ) {
        super();
        this.store.set({
            damping: 6,
            margin: 1.2,
            eps: 0.01,
            fit: false,
            clip: false,
        });
    }

    private readonly registerAnimation = this.store.effect<void>(
        tapEffect(() => {
            const animationUuid = this.animationFrameStore.register({
                callback: ({ delta }) => {
                    if (this.context.currentAnimating) {
                        const { damping, eps } = this.store.get();
                        const camera = this.canvasStore.get((s) => s.camera);
                        const controls = this.canvasStore.get(
                            (s) => s.controls
                        ) as unknown as ControlsProto;

                        NgtSobaBounds.damp(
                            this.context.currentFocus,
                            this.context.goalFocus,
                            damping,
                            delta
                        );
                        NgtSobaBounds.damp(
                            this.context.currentCamera,
                            this.context.goalCamera,
                            damping,
                            delta
                        );
                        this.context.currentZoom = THREE.MathUtils.damp(
                            this.context.currentZoom,
                            this.context.goalZoom,
                            damping,
                            delta
                        );
                        camera.position.copy(this.context.currentCamera);

                        if (is.orthographic(camera)) {
                            camera.zoom = this.context.currentZoom;
                            camera.updateProjectionMatrix();
                        }

                        if (!controls) {
                            camera.lookAt(this.context.currentFocus);
                        } else {
                            controls.target.copy(this.context.currentFocus);
                            controls.update();
                        }

                        this.loop.invalidate();
                        if (
                            is.orthographic(camera) &&
                            !(
                                Math.abs(
                                    this.context.currentZoom -
                                        this.context.goalZoom
                                ) < eps
                            )
                        )
                            return;
                        if (
                            !is.orthographic(camera) &&
                            !this.equals(
                                this.context.currentCamera,
                                this.context.goalCamera
                            )
                        )
                            return;
                        if (
                            controls &&
                            !this.equals(
                                this.context.currentFocus,
                                this.context.goalFocus
                            )
                        )
                            return;
                        this.context.currentAnimating = false;
                    }
                },
            });

            return () => {
                this.animationFrameStore.unregister(animationUuid);
            };
        })
    );

    private eventParams$ = this.store.select(
        this.canvasStore.select(
            (s) => s.controls
        ) as unknown as Observable<ControlsProto>,
        this.store.select((s) => s.clip),
        this.store.select((s) => s.fit),
        (controls, clip, fit) => ({ controls, clip, fit })
    );

    private readonly configureEvent = this.store.effect<{
        controls: ControlsProto;
        clip: boolean;
        fit: boolean;
    }>(
        tapEffect(({ controls, clip, fit }) => {
            this.context.refresh();
            if (fit) this.context.fit();
            if (clip) this.context.clip();

            if (controls) {
                // Try to prevent drag hijacking
                const callback = () => (this.context.currentAnimating = false);
                controls.addEventListener('start', callback);
                return () => controls.removeEventListener('start', callback);
            }
            return;
        })
    );

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.store.onCanvasReady(this.canvasStore.ready$, () => {
                this.configureEvent(this.eventParams$);
                this.registerAnimation();
            });
        });
    }

    private static damp(
        v: THREE.Vector3,
        t: THREE.Vector3,
        lambda: number,
        delta: number
    ) {
        v.x = THREE.MathUtils.damp(v.x, t.x, lambda, delta);
        v.y = THREE.MathUtils.damp(v.y, t.y, lambda, delta);
        v.z = THREE.MathUtils.damp(v.z, t.z, lambda, delta);
    }

    private equals(a: THREE.Vector3, b: THREE.Vector3) {
        const eps = this.store.get((s) => s.eps);
        return (
            Math.abs(a.x - b.x) < eps &&
            Math.abs(a.y - b.y) < eps &&
            Math.abs(a.z - b.z) < eps
        );
    }
}

@NgModule({
    declarations: [NgtSobaBounds],
    exports: [NgtSobaBounds, NgtObjectInputsControllerModule],
    imports: [NgtGroupModule, CommonModule],
})
export class NgtSobaBoundsModule {}
