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
    ngt-primitive[o3d],
    ngt-mesh[o3d],
    ngt-instanced-mesh[o3d],
    ngt-skinned-mesh[o3d],
    ngt-bone[o3d],
    ngt-group[o3d],
    ngt-lod[o3d],
    ngt-scene[o3d],
    ngt-points[o3d],
    ngt-cube-camera[o3d],
    ngt-contact-shadows[o3d],
    ngt-html[o3d],
    ngt-light-probe[o3d],
    ngt-ambient-light[o3d],
    ngt-ambient-light-probe[o3d],
    ngt-hemisphere-light[o3d],
    ngt-hemisphere-light-probe[o3d],
    ngt-directional-light[o3d],
    ngt-point-light[o3d],
    ngt-spot-light[o3d],
    ngt-rect-area-light[o3d],
    ngt-arrow-helper[o3d],
    ngt-axes-helper[o3d],
    ngt-box-helper[o3d],
    ngt-box3-helper[o3d],
    ngt-grid-helper[o3d],
    ngt-camera-helper[o3d],
    ngt-directional-light-helper[o3d],
    ngt-hemisphere-light-helper[o3d],
    ngt-plane-helper[o3d],
    ngt-point-light-helper[o3d],
    ngt-polar-grid-helper[o3d],
    ngt-skeleton-helper[o3d],
    ngt-spot-light-helper[o3d],
    ngt-line[o3d],
    ngt-line-loop[o3d],
    ngt-line-segments[o3d],
    ngt-sprite[o3d],
    ngt-camera[o3d],
    ngt-perspective-camera[o3d],
    ngt-orthographic-camera[o3d],
    ngt-array-camera[o3d],
    ngt-stereo-camera[o3d]
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
