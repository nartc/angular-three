// GENERATED

import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { Object3D } from 'three';
import {
  ThreeColor,
  ThreeEuler,
  ThreeEvent,
  ThreeQuaternion,
  ThreeVector3,
  UnknownRecord,
} from '../typings';
import { Controller } from './controller.abstract';

@Directive({
  selector: `
    ngt-primitive,
    ngt-mesh,
    ngt-instanced-mesh,
    ngt-skinned-mesh,
    ngt-bone,
    ngt-group,
    ngt-lod,
    ngt-scene,
    ngt-points,
    ngt-cube-camera,
    ngt-contact-shadows,
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
    ngt-box-helper,
    ngt-box3-helper,
    ngt-grid-helper,
    ngt-camera-helper,
    ngt-directional-light-helper,
    ngt-hemisphere-light-helper,
    ngt-plane-helper,
    ngt-point-light-helper,
    ngt-polar-grid-helper,
    ngt-skeleton-helper,
    ngt-spot-light-helper,
    ngt-line,
    ngt-line-loop,
    ngt-line-segments,
    ngt-sprite,
    ngt-camera,
    ngt-perspective-camera,
    ngt-orthographic-camera,
    ngt-array-camera,
    ngt-stereo-camera
  `,
  exportAs: 'ngtObject3dController',
})
export class Object3dControllerDirective extends Controller {
  @Input() name?: string;
  @Input() position?: ThreeVector3;
  @Input() rotation?: ThreeEuler;
  @Input() quaternion?: ThreeQuaternion;
  @Input() scale?: ThreeVector3;
  @Input() color?: ThreeColor;
  @Input() userData?: UnknownRecord;
  @Input() dispose?: () => void;
  @Input() castShadow = false;
  @Input() receiveShadow = false;
  @Input() visible = true;
  @Input() matrixAutoUpdate = true;

  @Input() appendMode: 'immediate' | 'root' = 'immediate';
  @Input() appendTo?: Object3D;

  // events
  @Output() click = new EventEmitter<ThreeEvent<MouseEvent>>();
  @Output() contextmenu = new EventEmitter<ThreeEvent<MouseEvent>>();
  @Output() dblclick = new EventEmitter<ThreeEvent<MouseEvent>>();
  @Output() pointerup = new EventEmitter<ThreeEvent<PointerEvent>>();
  @Output() pointerdown = new EventEmitter<ThreeEvent<PointerEvent>>();
  @Output() pointerover = new EventEmitter<ThreeEvent<PointerEvent>>();
  @Output() pointerout = new EventEmitter<ThreeEvent<PointerEvent>>();
  @Output() pointerenter = new EventEmitter<ThreeEvent<PointerEvent>>();
  @Output() pointerleave = new EventEmitter<ThreeEvent<PointerEvent>>();
  @Output() pointermove = new EventEmitter<ThreeEvent<PointerEvent>>();
  @Output() pointermissed = new EventEmitter<ThreeEvent<PointerEvent>>();
  @Output() pointercancel = new EventEmitter<ThreeEvent<PointerEvent>>();
  @Output() wheel = new EventEmitter<ThreeEvent<WheelEvent>>();
}
