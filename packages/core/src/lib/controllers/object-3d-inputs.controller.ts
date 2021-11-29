// GENERATED
import {
  Directive,
  EventEmitter,
  Input,
  NgModule,
  NgZone,
  Output,
} from '@angular/core';
import * as THREE from 'three';
import {
  NgtColor,
  NgtEuler,
  NgtEvent,
  NgtQuaternion,
  NgtVector3,
  UnknownRecord,
} from '../models';
import { makeColor, makeForSet, makeVector3 } from '../utils/make';
import { Controller, createControllerProviderFactory } from './controller';

@Directive({
  selector: `
    ngt-primitive,
    ngt-bone,
    ngt-group,
    ngt-points,
    ngt-mesh,
    ngt-instanced-mesh,
    ngt-skinned-mesh,
    ngt-audio,
    ngt-positional-audio,
    ngt-light-probe,
    ngt-ambient-light,
    ngt-ambient-light-probe,
    ngt-hemisphere-light
    ngt-hemisphere-light-probe,
    ngt-directional-light,
    ngt-point-light,
    ngt-spot-light,
    ngt-rect-area-light,
  `,
  exportAs: 'ngtObject3dInputsController',
})
export class NgtObject3dInputsController extends Controller {
  @Input() name?: string;

  @Input() set position(position: NgtVector3 | undefined) {
    this.#position = makeVector3(position);
  }

  get position() {
    return this.#position;
  }

  #position?: THREE.Vector3;

  @Input() set rotation(rotation: NgtEuler | undefined) {
    this.#rotation = makeForSet(THREE.Euler, rotation);
  }

  get rotation() {
    return this.#rotation;
  }

  #rotation?: THREE.Euler;

  @Input() set quaternion(quaternion: NgtQuaternion | undefined) {
    this.#quaternion = makeForSet(THREE.Quaternion, quaternion);
  }

  get quaternion() {
    return this.#quaternion;
  }

  #quaternion?: THREE.Quaternion;

  @Input() set scale(scale: NgtVector3 | undefined) {
    this.#scale = makeVector3(scale);
  }

  get scale() {
    return this.#scale;
  }

  #scale?: THREE.Vector3;

  @Input() set color(color: NgtColor | undefined) {
    this.#color = makeColor(color);
  }

  get color() {
    return this.#color;
  }

  #color?: THREE.Color;

  @Input() userData?: UnknownRecord;
  @Input() castShadow = false;
  @Input() receiveShadow = false;
  @Input() visible = true;
  @Input() matrixAutoUpdate = true;
  @Input() dispose?: () => void;

  @Input() appendMode: 'immediate' | 'root' | 'none' = 'immediate';
  @Input() appendTo?: THREE.Object3D;

  @Input() object3dInputsController?: NgtObject3dInputsController;

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

  get props(): string[] {
    return [
      'name',
      'position',
      'rotation',
      'quaternion',
      'scale',
      'color',
      'userData',
      'dispose',
      'castShadow',
      'receiveShadow',
      'visible',
      'matrixAutoUpdate',
      'appendMode',
      'appendTo',
      'click',
      'contextmenu',
      'dblclick',
      'pointerup',
      'pointerdown',
      'pointerover',
      'pointerout',
      'pointerenter',
      'pointerleave',
      'pointermove',
      'pointermissed',
      'pointercancel',
      'wheel',
    ];
  }

  get controller(): Controller | undefined {
    return this.object3dInputsController;
  }

  constructor(ngZone: NgZone) {
    super(ngZone);
  }

  get object3dProps() {
    return {
      name: this.name,
      position: this.position,
      rotation: this.rotation,
      quaternion: this.quaternion,
      scale: this.scale,
      color: this.color,
      userData: this.userData,
      dispose: this.dispose,
      castShadow: this.castShadow,
      receiveShadow: this.receiveShadow,
      visible: this.visible,
      matrixAutoUpdate: this.matrixAutoUpdate,
    };
  }
}

@NgModule({
  declarations: [NgtObject3dInputsController],
  exports: [NgtObject3dInputsController],
})
export class NgtObject3dInputsControllerModule {}

export const [
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
] = createControllerProviderFactory({
  watchedControllerTokenName: 'Watched Object3dInputsController',
  controller: NgtObject3dInputsController,
});
