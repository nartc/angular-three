import { createInjectionToken, extend, injectNgtRef, injectNgtStore, is, NgtRxStore } from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { RxActionFactory } from '@rx-angular/state/actions';
import { combineLatest, switchMap } from 'rxjs';
import { Box3, Group, MathUtils, Object3D, Vector3 } from 'three';

export interface NgtsBoundsSize {
    box: Box3;
    size: Vector3;
    center: Vector3;
    distance: number;
}

export interface NgtsBoundsApi {
    getSize: () => NgtsBoundsSize;
    refresh: (object?: Object3D | Box3) => NgtsBoundsApi;
    clip: () => NgtsBoundsApi;
    fit: () => NgtsBoundsApi;
    to: ({
        position,
        target,
    }: {
        position: [number, number, number];
        target?: [number, number, number];
    }) => NgtsBoundsApi;
}

type ControlsProto = {
    update(): void;
    target: Vector3;
    maxDistance: number;
    addEventListener: (event: string, callback: (event: any) => void) => void;
    removeEventListener: (event: string, callback: (event: any) => void) => void;
};

const isBox3 = (def: unknown): def is Box3 => !!def && (def as THREE.Box3).isBox3;

function equals(a: Vector3, b: Vector3, eps: number) {
    return Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps && Math.abs(a.z - b.z) < eps;
}

function damp(v: Vector3, t: Vector3, lambda: number, delta: number) {
    v.x = MathUtils.damp(v.x, t.x, lambda, delta);
    v.y = MathUtils.damp(v.y, t.y, lambda, delta);
    v.z = MathUtils.damp(v.z, t.z, lambda, delta);
}

export const [injectNgtsBoundsApi, provideNgtsBoundsApi] = createInjectionToken<NgtsBoundsApi>('NgtsBounds API');

extend({ Group });

@Component({
    selector: 'ngts-bounds',
    standalone: true,
    template: `
        <ngt-group ngtCompound [ref]="groupRef">
            <ng-content />
        </ngt-group>
    `,
    providers: [
        provideNgtsBoundsApi([NgtsBounds], (bounds: NgtsBounds) => {
            const store = injectNgtStore();
            const box = new Box3();

            function getSize() {
                const camera = store.get('camera');
                const margin = bounds.get('margin');

                const size = box.getSize(new Vector3());
                const center = box.getCenter(new Vector3());
                const maxSize = Math.max(size.x, size.y, size.z);
                const fitHeightDistance = is.orthographicCamera(camera)
                    ? maxSize * 4
                    : maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
                const fitWidthDistance = is.orthographicCamera(camera)
                    ? maxSize * 4
                    : fitHeightDistance / camera.aspect;
                const distance = margin * Math.max(fitHeightDistance, fitWidthDistance);
                return { box, size, center, distance };
            }

            const api = {
                getSize,
                refresh(object?: Object3D | Box3) {
                    const { camera, controls: storeControls } = store.get();
                    const controls = storeControls as unknown as ControlsProto;

                    if (isBox3(object)) box.copy(object);
                    else {
                        const target = object || bounds.groupRef.nativeElement;
                        if (target) {
                            target.updateWorldMatrix(true, true);
                            box.setFromObject(target);
                        }
                    }
                    if (box.isEmpty()) {
                        const max = camera.position.length() || 10;
                        box.setFromCenterAndSize(new Vector3(), new Vector3(max, max, max));
                    }

                    if (controls?.constructor.name === 'OrthographicTrackballControls') {
                        // put camera on a sphere along which it would move
                        const { distance } = getSize();
                        const direction = camera.position
                            .clone()
                            .sub(controls.target)
                            .normalize()
                            .multiplyScalar(distance);
                        const newPos = controls.target.clone().add(direction);
                        camera.position.copy(newPos);
                    }
                    return this;
                },
                clip() {
                    const { distance } = getSize();
                    const { camera, controls: storeControls, invalidate } = store.get();
                    const controls = storeControls as unknown as ControlsProto;
                    if (controls) controls.maxDistance = distance * 10;
                    camera.near = distance / 100;
                    camera.far = distance * 100;
                    camera.updateProjectionMatrix();
                    if (controls) controls.update();
                    invalidate();
                    return this;
                },
                to({ position, target }: { position: [number, number, number]; target?: [number, number, number] }) {
                    const { camera } = store.get();
                    const { damping } = bounds.get();

                    bounds.current.camera.copy(camera.position);
                    const { center } = getSize();
                    bounds.goal.camera.set(...position);

                    if (target) {
                        bounds.goal.focus.set(...target);
                    } else {
                        bounds.goal.focus.copy(center);
                    }

                    if (damping) {
                        bounds.current.animating = true;
                    } else {
                        camera.position.set(...position);
                    }

                    return this;
                },
                fit() {
                    const { camera, controls: storeControls, invalidate } = store.get();
                    const controls = storeControls as unknown as ControlsProto;

                    const { damping, margin } = bounds.get();

                    bounds.current.camera.copy(camera.position);
                    if (controls) bounds.current.focus.copy(controls.target);

                    const { center, distance } = getSize();
                    const direction = center.clone().sub(camera.position).normalize().multiplyScalar(distance);

                    bounds.goal.camera.copy(center).sub(direction);
                    bounds.goal.focus.copy(center);

                    if (is.orthographicCamera(camera)) {
                        bounds.current.zoom = camera.zoom;

                        let maxHeight = 0,
                            maxWidth = 0;
                        const vertices = [
                            new Vector3(box.min.x, box.min.y, box.min.z),
                            new Vector3(box.min.x, box.max.y, box.min.z),
                            new Vector3(box.min.x, box.min.y, box.max.z),
                            new Vector3(box.min.x, box.max.y, box.max.z),
                            new Vector3(box.max.x, box.max.y, box.max.z),
                            new Vector3(box.max.x, box.max.y, box.min.z),
                            new Vector3(box.max.x, box.min.y, box.max.z),
                            new Vector3(box.max.x, box.min.y, box.min.z),
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
                        bounds.goal.zoom = Math.min(zoomForHeight, zoomForWidth) / margin;
                        if (!damping) {
                            camera.zoom = bounds.goal.zoom;
                            camera.updateProjectionMatrix();
                        }
                    }

                    if (damping) {
                        bounds.current.animating = true;
                    } else {
                        camera.position.copy(bounds.goal.camera);
                        camera.lookAt(bounds.goal.focus);
                        if (controls) {
                            controls.target.copy(bounds.goal.focus);
                            controls.update();
                        }
                    }
                    if (bounds.fitted.observed) bounds.fitted.emit(this.getSize());
                    invalidate();
                    return this;
                },
            } as NgtsBoundsApi;

            let count = 0;
            bounds.hold(
                bounds.groupRef.$.pipe(
                    switchMap(() =>
                        combineLatest([
                            bounds.select(selectSlice(['clip', 'fit', 'observe'])),
                            store.select(selectSlice(['camera', 'controls', 'size'])),
                            bounds.groupRef.children$(),
                        ])
                    )
                ),
                ([{ clip, fit, observe }]) => {
                    if (observe || count++ === 0) {
                        api.refresh();
                        if (fit) api.fit();
                        if (clip) api.clip();
                    }
                }
            );

            return api;
        }),
        RxActionFactory,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsBounds extends NgtRxStore implements OnInit {
    @Input() groupRef = injectNgtRef<Group>();

    @Input() set damping(damping: number) {
        this.set({ damping: damping === undefined ? this.get('damping') : damping });
    }

    @Input() set fit(fit: boolean) {
        this.set({ fit: fit === undefined ? this.get('fit') : fit });
    }

    @Input() set clip(clip: boolean) {
        this.set({ clip: clip === undefined ? this.get('clip') : clip });
    }

    @Input() set observe(observe: boolean) {
        this.set({ observe: observe === undefined ? this.get('observe') : observe });
    }

    @Input() set margin(margin: number) {
        this.set({ margin: margin === undefined ? this.get('margin') : margin });
    }

    @Input() set eps(eps: number) {
        this.set({ eps: eps === undefined ? this.get('eps') : eps });
    }

    @Output() fitted = new EventEmitter<NgtsBoundsSize>();

    readonly #store = injectNgtStore();
    readonly #actions = inject(RxActionFactory<{ setBeforeRender: void }>).create();

    readonly current = { animating: false, focus: new Vector3(), camera: new Vector3(), zoom: 1 };
    readonly goal = { focus: new Vector3(), camera: new Vector3(), zoom: 1 };

    override initialize() {
        super.initialize();
        this.set({
            damping: 6,
            fit: false,
            clip: false,
            observe: false,
            margin: 1.2,
            eps: 0.01,
        });
    }

    ngOnInit() {
        this.#preventDragHijacking();
        this.#setBeforeRender();
    }

    #preventDragHijacking() {
        this.effect(this.#store.select('controls'), (controls) => {
            if (controls) {
                const callback = () => (this.current.animating = false);
                (controls as unknown as ControlsProto).addEventListener('start', callback);
                return () => (controls as unknown as ControlsProto).removeEventListener('start', callback);
            }
        });
    }

    #setBeforeRender() {
        this.effect(this.#actions.setBeforeRender$, () =>
            this.#store.get('internal').subscribe(({ delta }) => {
                if (this.current.animating) {
                    const { damping, eps } = this.get();
                    const { camera, controls: storeControls, invalidate } = this.#store.get();
                    const controls = storeControls as unknown as ControlsProto;

                    damp(this.current.focus, this.goal.focus, damping, delta);
                    damp(this.current.camera, this.goal.camera, damping, delta);
                    this.current.zoom = MathUtils.damp(this.current.zoom, this.goal.zoom, damping, delta);
                    camera.position.copy(this.current.camera);

                    if (is.orthographicCamera(camera)) {
                        camera.zoom = this.current.zoom;
                        camera.updateProjectionMatrix();
                    }

                    if (!controls) {
                        camera.lookAt(this.current.focus);
                    } else {
                        controls.target.copy(this.current.focus);
                        controls.update();
                    }

                    invalidate();
                    if (is.orthographicCamera(camera) && !(Math.abs(this.current.zoom - this.goal.zoom) < eps)) return;
                    if (!is.orthographicCamera(camera) && !equals(this.current.camera, this.goal.camera, eps)) return;
                    if (controls && !equals(this.current.focus, this.goal.focus, eps)) return;
                    this.current.animating = false;
                }
            })
        );

        this.#actions.setBeforeRender();
    }
}
