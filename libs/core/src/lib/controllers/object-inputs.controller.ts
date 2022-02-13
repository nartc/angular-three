// GENERATED
import {
    Directive,
    EventEmitter,
    Input,
    NgModule,
    Output,
} from '@angular/core';
import * as THREE from 'three';
import type {
    NgtColor,
    NgtEuler,
    NgtEvent,
    NgtObject3dProps,
    NgtQuaternion,
    NgtVector3,
    UnknownRecord,
} from '../types';
import { makeColor, makeForSet, makeVector3 } from '../utils/make';
import { Controller, createControllerProviderFactory } from './controller';

@Directive({
    selector: `
    ngt-primitive,
    ngt-bone,
    ngt-group,
    ngt-lod,
    ngt-points,
    ngt-mesh,
    ngt-instanced-mesh,
    ngt-skinned-mesh,
    ngt-audio,
    ngt-positional-audio,
    ngt-line,
    ngt-line-loop,
    ngt-line-segments,
    ngt-light-probe,
    ngt-ambient-light,
    ngt-ambient-light-probe,
    ngt-hemisphere-light,
    ngt-hemisphere-light-probe,
    ngt-directional-light,
    ngt-point-light,
    ngt-spot-light,
    ngt-rect-area-light,
    ngt-arrow-helper,
    ngt-axes-helper,
    ngt-box3-helper,
    ngt-grid-helper,
    ngt-plane-helper,
    ngt-polar-grid-helper,
    ngt-sprite,
    ngt-camera,
    ngt-perspective-camera,
    ngt-orthographic-camera,
    ngt-array-camera,
    ngt-stereo-camera,
    ngt-cube-camera,
    ngt-soba-billboard,
    ngt-soba-detailed,
    ngt-soba-line,
    ngt-soba-quadratic-bezier-line,
    ngt-soba-cubic-bezier-line,
    ngt-soba-orthographic-camera,
    ngt-soba-gizmo-helper,
    ngt-soba-gizmo-viewport,
    ngt-soba-gizmo-axis-head,
    ngt-soba-transform-controls,
    ngt-soba-center,
    ngt-soba-bounds,
    ngt-soba-float,
    ngt-soba-stage,
    ngt-soba-backdrop,
    ngt-soba-spot-light,
    ngt-soba-text
  `,
    exportAs: 'ngtObjectInputsController',
})
export class NgtObjectInputsController extends Controller {
    @Input() name?: string;

    @Input() set position(position: NgtVector3 | undefined) {
        this._position = makeVector3(position);
    }

    get position() {
        return this._position;
    }

    private _position?: THREE.Vector3;

    @Input() set rotation(rotation: NgtEuler | undefined) {
        this._rotation = makeForSet(THREE.Euler, rotation);
    }

    get rotation() {
        return this._rotation;
    }

    private _rotation?: THREE.Euler;

    @Input() set quaternion(quaternion: NgtQuaternion | undefined) {
        this._quaternion = makeForSet(THREE.Quaternion, quaternion);
    }

    get quaternion() {
        return this._quaternion;
    }

    private _quaternion?: THREE.Quaternion;

    @Input() set scale(scale: NgtVector3 | undefined) {
        this._scale = makeVector3(scale);
    }

    get scale() {
        return this._scale;
    }

    private _scale?: THREE.Vector3;

    @Input() set color(color: NgtColor | undefined) {
        this._color = makeColor(color);
    }

    get color() {
        return this._color;
    }

    private _color?: THREE.Color;

    @Input() userData?: UnknownRecord;
    @Input() castShadow?: boolean;
    @Input() receiveShadow?: boolean;
    @Input() visible = true;
    @Input() matrixAutoUpdate = true;
    @Input() dispose?: (() => void) | null;
    @Input() raycast?: THREE.Object3D['raycast'] | null;

    @Input() appendMode: 'immediate' | 'root' | 'none' = 'immediate';
    @Input() appendTo?: THREE.Object3D | (() => THREE.Object3D);

    // events
    @Output() click = new EventEmitter<NgtEvent<MouseEvent>>();
    @Output() contextmenu = new EventEmitter<NgtEvent<MouseEvent>>();
    @Output() dblclick = new EventEmitter<NgtEvent<MouseEvent>>();
    @Output() pointerup = new EventEmitter<NgtEvent<PointerEvent>>();
    @Output() pointerdown = new EventEmitter<NgtEvent<PointerEvent>>();
    @Output() pointerover = new EventEmitter<NgtEvent<PointerEvent>>();
    @Output() pointerout = new EventEmitter<NgtEvent<PointerEvent>>();
    @Output() pointerenter = new EventEmitter<NgtEvent<PointerEvent>>();
    @Output() pointerleave = new EventEmitter<NgtEvent<PointerEvent>>();
    @Output() pointermove = new EventEmitter<NgtEvent<PointerEvent>>();
    @Output() pointermissed = new EventEmitter<NgtEvent<PointerEvent>>();
    @Output() pointercancel = new EventEmitter<NgtEvent<PointerEvent>>();
    @Output() wheel = new EventEmitter<NgtEvent<WheelEvent>>();

    get object3dProps(): NgtObject3dProps {
        return {
            name: this.name,
            position: this._position?.toArray(),
            rotation: this._rotation?.toArray() as NgtEuler,
            quaternion: this._quaternion?.toArray() as NgtQuaternion,
            scale: this._scale?.toArray(),
            color: this.color,
            userData: this.userData,
            dispose: this.dispose,
            raycast: this.raycast,
            castShadow: this.castShadow,
            receiveShadow: this.receiveShadow,
            visible: this.visible,
            matrixAutoUpdate: this.matrixAutoUpdate,
        };
    }
}

@NgModule({
    declarations: [NgtObjectInputsController],
    exports: [NgtObjectInputsController],
})
export class NgtObjectInputsControllerModule {}

export const [
    NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
] = createControllerProviderFactory({
    watchedControllerTokenName: 'Watched ObjectInputsController',
    controller: NgtObjectInputsController,
});

/**
 * Used to assign on other object
 * [name]="objectInputsController.name"
 * [position]="objectInputsController.position"
 * [rotation]="objectInputsController.rotation"
 * [quaternion]="objectInputsController.quaternion"
 * [scale]="objectInputsController.scale"
 * [color]="objectInputsController.color"
 * [userData]="objectInputsController.userData"
 * [castShadow]="objectInputsController.castShadow"
 * [receiveShadow]="objectInputsController.receiveShadow"
 * [visible]="objectInputsController.visible"
 * [matrixAutoUpdate]="objectInputsController.matrixAutoUpdate"
 * [dispose]="objectInputsController.dispose"
 * [raycast]="objectInputsController.raycast"
 * [appendMode]="objectInputsController.appendMode"
 * [appendTo]="objectInputsController.appendTo"
 * (click)="objectInputsController.click.emit($event)"
 * (contextmenu)="objectInputsController.contextmenu.emit($event)"
 * (dblclick)="objectInputsController.dblclick.emit($event)"
 * (pointerup)="objectInputsController.pointerup.emit($event)"
 * (pointerdown)="objectInputsController.pointerdown.emit($event)"
 * (pointerover)="objectInputsController.pointerover.emit($event)"
 * (pointerout)="objectInputsController.pointerout.emit($event)"
 * (pointerenter)="objectInputsController.pointerenter.emit($event)"
 * (pointerleave)="objectInputsController.pointerleave.emit($event)"
 * (pointermove)="objectInputsController.pointermove.emit($event)"
 * (pointermissed)="objectInputsController.pointermissed.emit($event)"
 * (pointercancel)="objectInputsController.pointercancel.emit($event)"
 * (wheel)="objectInputsController.wheel.emit($event)"
 */
