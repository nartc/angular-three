import {
    BooleanInput,
    coerceBooleanProperty,
    coerceNumberProperty,
    NgtInstance,
    NgtInstanceState,
    NgtVector3,
    NumberInput,
    provideInstanceRef,
    tapEffect,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    NgModule,
    Output,
} from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

export interface NgtSobaOrbitControlsState
    extends NgtInstanceState<OrbitControls> {
    camera?: THREE.Camera;
    domElement?: HTMLElement;
    enableDamping?: boolean;
    makeDefault?: boolean;
    regress?: boolean;
    target?: NgtVector3;
}

@Component({
    selector: 'ngt-soba-orbit-controls',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideInstanceRef(NgtSobaOrbitControls)],
})
export class NgtSobaOrbitControls extends NgtInstance<
    OrbitControls,
    NgtSobaOrbitControlsState
> {
    @Input() set camera(camera: THREE.Camera) {
        this.set({ camera });
    }

    @Input() set domElement(domElement: HTMLElement) {
        this.set({ domElement });
    }

    @Input() set makeDefault(makeDefault: BooleanInput) {
        this.set({ makeDefault: coerceBooleanProperty(makeDefault) });
    }

    @Input() set regress(regress: BooleanInput) {
        this.set({ regress: coerceBooleanProperty(regress) });
    }

    @Input() set target(target: NgtVector3) {
        this.set({ target });
    }

    @Input() set enableDamping(enableDamping: BooleanInput) {
        this.set({ enableDamping: coerceBooleanProperty(enableDamping) });
    }

    @Input() set minDistance(minDistance: NumberInput) {
        this.set({ minDistance: coerceNumberProperty(minDistance) });
    }

    @Input() set maxDistance(maxDistance: NumberInput) {
        this.set({ maxDistance: coerceNumberProperty(maxDistance) });
    }

    @Input() set minZoom(minZoom: NumberInput) {
        this.set({ minZoom: coerceNumberProperty(minZoom) });
    }

    @Input() set maxZoom(maxZoom: NumberInput) {
        this.set({ maxZoom: coerceNumberProperty(maxZoom) });
    }

    @Input() set minPolarAngle(minPolarAngle: NumberInput) {
        this.set({ minPolarAngle: coerceNumberProperty(minPolarAngle) });
    }

    @Input() set maxPolarAngle(maxPolarAngle: NumberInput) {
        this.set({ maxPolarAngle: coerceNumberProperty(maxPolarAngle) });
    }

    @Input() set minAzimuthAngle(minAzimuthAngle: NumberInput) {
        this.set({ minAzimuthAngle: coerceNumberProperty(minAzimuthAngle) });
    }

    @Input() set maxAzimuthAngle(maxAzimuthAngle: NumberInput) {
        this.set({ maxAzimuthAngle: coerceNumberProperty(maxAzimuthAngle) });
    }

    @Input() set dampingFactor(dampingFactor: NumberInput) {
        this.set({ dampingFactor: coerceNumberProperty(dampingFactor) });
    }

    @Input() set enableZoom(enableZoom: BooleanInput) {
        this.set({ enableZoom: coerceBooleanProperty(enableZoom) });
    }

    @Input() set zoomSpeed(zoomSpeed: NumberInput) {
        this.set({ zoomSpeed: coerceNumberProperty(zoomSpeed) });
    }

    @Input() set enableRotate(enableRotate: BooleanInput) {
        this.set({ enableRotate: coerceBooleanProperty(enableRotate) });
    }

    @Input() set rotateSpeed(rotateSpeed: NumberInput) {
        this.set({ rotateSpeed: coerceNumberProperty(rotateSpeed) });
    }

    @Input() set enablePan(enablePan: BooleanInput) {
        this.set({ enablePan: coerceBooleanProperty(enablePan) });
    }

    @Input() set panSpeed(panSpeed: NumberInput) {
        this.set({ panSpeed: coerceNumberProperty(panSpeed) });
    }

    @Input() set screenSpacePanning(screenSpacePanning: BooleanInput) {
        this.set({
            screenSpacePanning: coerceBooleanProperty(screenSpacePanning),
        });
    }

    @Input() set keyPanSpeed(keyPanSpeed: NumberInput) {
        this.set({ keyPanSpeed: coerceNumberProperty(keyPanSpeed) });
    }

    @Input() set autoRotate(autoRotate: BooleanInput) {
        this.set({ autoRotate: coerceBooleanProperty(autoRotate) });
    }

    @Input() set autoRotateSpeed(autoRotateSpeed: NumberInput) {
        this.set({ autoRotateSpeed: coerceNumberProperty(autoRotateSpeed) });
    }

    @Input() set reverseOrbit(reverseOrbit: BooleanInput) {
        this.set({ reverseOrbit: coerceBooleanProperty(reverseOrbit) });
    }

    @Input() set keys(keys: {
        LEFT: string;
        UP: string;
        RIGHT: string;
        BOTTOM: string;
    }) {
        this.set({ keys });
    }

    @Input() set mouseButtons(mouseButtons: {
        LEFT: THREE.MOUSE;
        MIDDLE: THREE.MOUSE;
        RIGHT: THREE.MOUSE;
    }) {
        this.set({ mouseButtons });
    }

    @Input() set touches(touches: { ONE: THREE.TOUCH; TWO: THREE.TOUCH }) {
        this.set({ touches });
    }

    @Output() change = new EventEmitter<THREE.Event>();
    @Output() start = new EventEmitter<THREE.Event>();
    @Output() end = new EventEmitter<THREE.Event>();

    protected override preInit() {
        this.set((state) => ({
            enableDamping: true,
            camera: state.camera || this.store.get((s) => s.camera),
            domElement:
                state.domElement ||
                this.store.get((s) => s.events.connected) ||
                this.store.get((s) => s.gl.domElement),
        }));
    }

    override ngOnInit() {
        super.ngOnInit();
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                this.init(this.select((s) => s.camera));
                this.setBeforeRender(this.instance$);
                this.connectDomElement(this.select((s) => s.domElement));
                this.setEvents(this.instance$);
                this.setDefaultControls(
                    this.select(
                        this.instance$,
                        this.select((s) => s.makeDefault)
                    )
                );
            });
        });
    }

    private readonly init = this.effect<{}>(
        tap(() => {
            const camera =
                this.get((s) => s.camera) || this.store.get((s) => s.camera);
            this.prepareInstance(new OrbitControls(camera));
        })
    );

    private readonly setBeforeRender = this.effect<{}>(
        tapEffect(() => {
            const unregister = this.store.registerBeforeRender({
                priority: -1,
                callback: () => {
                    if (this.instance.value.enabled) {
                        this.instance.value.update();
                    }
                },
            });

            return () => {
                unregister();
            };
        })
    );

    private readonly connectDomElement = this.effect<{}>(
        tapEffect(() => {
            const domElement =
                this.get((s) => s.domElement) ||
                this.store.get((s) => s.events.connected) ||
                this.store.get((s) => s.gl.domElement);

            this.instance.value.connect(domElement);

            return () => {
                this.instance.value.dispose();
            };
        })
    );

    private readonly setEvents = this.effect<{}>(
        tapEffect(() => {
            const { invalidate, performance } = this.store.get();
            const regress = this.get((s) => s.regress);

            const changeCallback: (e: THREE.Event) => void = (e) => {
                invalidate();
                if (regress) {
                    performance.regress();
                }

                if (this.change.observed) {
                    this.change.emit(e);
                }
            };
            let startCallback: (e: THREE.Event) => void;
            let endCallback: (e: THREE.Event) => void;

            this.instance.value.addEventListener('change', changeCallback);

            if (this.start.observed) {
                startCallback = (event: THREE.Event) => {
                    this.start.emit(event);
                };
                this.instance.value.addEventListener('start', startCallback);
            }

            if (this.end.observed) {
                endCallback = (event: THREE.Event) => {
                    this.end.emit(event);
                };
                this.instance.value.addEventListener('end', endCallback);
            }

            return () => {
                this.instance.value.removeEventListener(
                    'change',
                    changeCallback
                );
                if (endCallback)
                    this.instance.value.removeEventListener('end', endCallback);
                if (startCallback)
                    this.instance.value.removeEventListener(
                        'start',
                        startCallback
                    );
            };
        })
    );

    private readonly setDefaultControls = this.effect<{}>(
        tapEffect(() => {
            const makeDefault = this.get((s) => s.makeDefault);
            if (makeDefault) {
                const oldControls = this.store.get((s) => s.controls);
                this.store.set({ controls: this.instance.value });
                return () => {
                    this.store.set({ controls: oldControls });
                };
            }
            return;
        })
    );

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            target: true,
            enableDamping: false,
            minDistance: true,
            maxDistance: true,
            minZoom: true,
            maxZoom: true,
            minPolarAngle: true,
            maxPolarAngle: true,
            minAzimuthAngle: true,
            maxAzimuthAngle: true,
            dampingFactor: true,
            enableZoom: true,
            zoomSpeed: true,
            enableRotate: true,
            rotateSpeed: true,
            enablePan: true,
            panSpeed: true,
            screenSpacePanning: true,
            keyPanSpeed: true,
            autoRotate: true,
            autoRotateSpeed: true,
            reverseOrbit: true,
            keys: true,
            mouseButtons: true,
            touches: true,
        };
    }
}

@NgModule({
    declarations: [NgtSobaOrbitControls],
    exports: [NgtSobaOrbitControls],
})
export class NgtSobaOrbitControlsModule {}
