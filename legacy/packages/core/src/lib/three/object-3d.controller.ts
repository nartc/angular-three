// GENERATED

import { Directive, EventEmitter, Input, NgZone, Output } from '@angular/core';
import * as THREE from 'three';
import type {
  NgtColor,
  NgtEuler,
  NgtEvent,
  NgtQuaternion,
  NgtVector3,
  UnknownRecord,
} from '../models';
import { Controller } from '../utils/controller';

@Directive({
  selector: `
    ngt-primitive,
    ngt-mesh,
    ngt-instanced-mesh,
    ngt-skinned-mesh,
    ngt-bone,
    ngt-line2,
    ngt-line-segments2,
    ngt-wireframe,
    ngt-group,
    ngt-lod,
    ngt-scene,
    ngt-points,
    ngt-cube-camera,
    ngt-contact-shadows,
    ngt-html,
    ngt-audio,
    ngt-positional-audio,
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
    ngt-light-probe-helper,
    ngt-positional-audio-helper,
    ngt-rect-area-light-helper,
    ngt-vertex-normals-helper,
    ngt-vertex-tangents-helper,
    ngt-line,
    ngt-line-loop,
    ngt-line-segments,
    ngt-sprite,
    ngt-camera,
    ngt-perspective-camera,
    ngt-orthographic-camera,
    ngt-array-camera,
    ngt-stereo-camera
    ngt-soba-image,
    ngt-soba-text,
    ngt-soba-line,
    ngt-soba-quadratic-bezier-line,
    ngt-soba-cubic-bezier-line,
    ngt-soba-positional-audio,
    ngt-soba-billboard,
    ngt-soba-orthographic-camera,
    ngt-soba-gizmo-helper,
    ngt-soba-plane,
    ngt-soba-box,
    ngt-soba-cylinder,
    ngt-soba-cone,
    ngt-soba-circle,
    ngt-soba-sphere,
    ngt-soba-tube,
    ngt-soba-torus,
    ngt-soba-tetrahedron,
    ngt-soba-ring,
    ngt-soba-polyhedron,
    ngt-soba-octahedron,
    ngt-soba-dodecahedron,
    ngt-soba-icosahedron,
    ngt-soba-extrude,
    ngt-soba-lathe,
    ngt-soba-parametric,
    ngt-soba-torus-knot,
  `,
  exportAs: 'ngtObject3dController',
})
export class NgtObject3dController extends Controller {
  @Input() name?: string;
  @Input() position?: NgtVector3;
  @Input() rotation?: NgtEuler;
  @Input() quaternion?: NgtQuaternion;
  @Input() scale?: NgtVector3;
  @Input() color?: NgtColor;
  @Input() userData?: UnknownRecord;
  @Input() dispose?: () => void;
  @Input() castShadow = false;
  @Input() receiveShadow = false;
  @Input() visible = true;
  @Input() matrixAutoUpdate = true;

  @Input() appendMode: 'immediate' | 'root' | 'none' = 'immediate';
  @Input() appendTo?: THREE.Object3D;

  @Input() object3dController?: NgtObject3dController;

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
    return this.object3dController;
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
