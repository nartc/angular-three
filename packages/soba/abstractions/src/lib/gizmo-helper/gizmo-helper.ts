import {
    injectInstance,
    make,
    NgtInstance,
    NgtObservableInput,
    NgtPortal,
    NgtRef,
    NgtStore,
    NgtWrapper,
    prepare,
    provideInstanceRef,
    tapEffect,
} from '@angular-three/core';
import { NgtGroup } from '@angular-three/core/objects';
import { SobaOrthographicCamera } from '@angular-three/soba/cameras';
import { useCamera } from '@angular-three/soba/misc';
import { Component, EventEmitter, inject, Input, NgZone, OnInit, Output } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS } from '../common';

type ControlsProto = { update(): void; target: THREE.Vector3 };

const turnRate = 2 * Math.PI; // turn rate in angles per second
const dummy = new THREE.Object3D();
const matrix = new THREE.Matrix4();
const [q1, q2] = [new THREE.Quaternion(), new THREE.Quaternion()];
const target = new THREE.Vector3();
const targetPosition = new THREE.Vector3();

@Component({
    selector: 'ngt-soba-gizmo-helper',
    standalone: true,
    template: `
        <ngt-portal [container]="instance.readKey('virtualScene')">
            <ngt-soba-orthographic-camera
                [ref]="instance.readKey('virtualCamera')"
                [position]="[0, 0, 200]"
            ></ngt-soba-orthographic-camera>
            <ngt-group *wrapper="this" [position]="position$">
                <ng-content></ng-content>
            </ngt-group>
        </ngt-portal>
    `,
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(SobaGizmoHelper)],
    imports: [NgtPortal, SobaOrthographicCamera, NgtGroup, NgtWrapper],
})
export class SobaGizmoHelper extends NgtGroup implements OnInit {
    @Input() set alignment(alignment: NgtObservableInput<'top-left' | 'top-right' | 'bottom-right' | 'bottom-left'>) {
        this.instance.write({ alignment });
    }

    @Input() set margin(margin: NgtObservableInput<[number, number]>) {
        this.instance.write({ margin });
    }

    @Input() set renderPriority(renderPriority: number) {
        this.instance.write({ renderPriority });
    }

    @Input() set autoClear(autoClear: NgtObservableInput<boolean>) {
        this.instance.write({ autoClear });
    }

    @Output() update = new EventEmitter();

    protected readonly instance = injectInstance({ host: true });
    private readonly store = inject(NgtStore);
    private readonly zone = inject(NgZone);

    private __animating__ = false;
    private __focusPoint__ = new THREE.Vector3();
    private __radius__ = 0;

    readonly position$ = this.instance.select(
        this.instance.select((s) => s['margin']),
        this.instance.select((s) => s['alignment']),
        this.store.select((s) => s.size),
        ([marginX, marginY], alignment, size) => {
            const x = alignment.endsWith('-left') ? -size.width / 2 + marginX : size.width / 2 - marginX;
            const y = alignment.startsWith('top-') ? size.height / 2 - marginY : -size.height / 2 + marginY;

            return make(THREE.Vector3, [x, y, 0]);
        },
        { debounce: true }
    );

    private readonly __switchBackground__ = this.instance.effect<void>(
        tapEffect(() => {
            let mainSceneBackground: THREE.Scene['background'];
            const scene = this.store.read((s) => s.scene);
            const virtualScene = this.instance.read((s) => s['virtualScene']) as NgtRef<THREE.Scene>;

            if (scene.background) {
                mainSceneBackground = scene.background;
                scene.background = null;
                virtualScene.value.background = mainSceneBackground;
            }

            return () => {
                if (mainSceneBackground) scene.background = mainSceneBackground;
            };
        })
    );

    private readonly __setBeforeRender__ = this.instance.effect<void>(
        tapEffect(() => {
            const renderPriority = this.instance.read((s) => s['renderPriority']);
            const gl = this.store.read((s) => s.gl);
            const internal = this.store.read((s) => s.internal);

            return internal.subscribe(
                ({ delta }) => {
                    const { camera: mainCamera, controls: defaultControls, invalidate } = this.store.read();
                    const { virtualScene, virtualCamera, autoClear } = this.instance.read();

                    if (virtualScene.value && virtualCamera.value) {
                        if (this.__animating__) {
                            if (q1.angleTo(q2) < 0.01) {
                                this.__animating__ = false;
                            } else {
                                const step = delta * turnRate;
                                // animate position by doing a slerp and then scaling the position on the unit sphere
                                q1.rotateTowards(q2, step);
                                // animate orientation
                                mainCamera.position
                                    .set(0, 0, 1)
                                    .applyQuaternion(q1)
                                    .multiplyScalar(this.__radius__)
                                    .add(this.__focusPoint__);
                                mainCamera.up.set(0, 1, 0).applyQuaternion(q1).normalize();
                                mainCamera.quaternion.copy(q1);
                                if (this.update.observed) {
                                    this.update.emit();
                                } else if (defaultControls) {
                                    (defaultControls as unknown as ControlsProto).update();
                                }

                                invalidate();
                            }
                        }

                        // Sync Gizmo with main camera orientation
                        matrix.copy(mainCamera.matrix).invert();
                        this.quaternion.setFromRotationMatrix(matrix);

                        // Render virtual camera
                        if (autoClear) {
                            gl.autoClear = false;
                        }
                        gl.clearDepth();
                        gl.render(virtualScene.value, virtualCamera.value);
                    }
                },
                renderPriority,
                this.store.read
            );
        })
    );

    constructor() {
        super();
        this.instance.write({
            virtualCamera: new NgtRef(),
            alignment: 'bottom-right',
            margin: [80, 80],
            renderPriority: 0,
            autoClear: true,
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.instance.write({
                virtualScene: new NgtRef(prepare(new THREE.Scene(), this.store.read, this.store.rootStateFactory)),
                gizmoRaycast: useCamera(
                    this.instance.read((s) => s['virtualCamera']),
                    this.store.read((s) => s.pointer)
                ),
            });

            this.__switchBackground__();
            this.__setBeforeRender__();
        });
    }

    tweenCamera(direction: THREE.Vector3) {
        this.__animating__ = true;

        const { controls: defaultControls, camera: mainCamera, invalidate } = this.store.read();

        if (defaultControls) {
            this.__focusPoint__ = (defaultControls as unknown as ControlsProto).target;
        }

        this.__radius__ = mainCamera.position.distanceTo(target);

        // Rotate from current camera orientation
        q1.copy(mainCamera.quaternion);

        // To new current camera orientation
        targetPosition.copy(direction).multiplyScalar(this.__radius__).add(target);
        dummy.lookAt(targetPosition);
        q2.copy(dummy.quaternion);

        invalidate();
    }
}
