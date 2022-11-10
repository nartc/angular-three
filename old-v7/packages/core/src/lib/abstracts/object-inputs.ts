import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { isObservable, map } from 'rxjs';
import * as THREE from 'three';
import { injectObjectHostRef, injectObjectRef } from '../di/three';
import { NgtRef } from '../ref';
import type {
  NgtBooleanInput,
  NgtColor,
  NgtEuler,
  NgtNumberInput,
  NgtObservableInput,
  NgtQuaternion,
  NgtThreeEvent,
  NgtTriple,
  NgtUnknownRecord,
  NgtVector3,
} from '../types';
import { coerceBoolean, coerceNumber } from '../utils/coercion';
import { is } from '../utils/is';
import { make } from '../utils/make';
import { NgtInstance, NgtInstanceState } from './instance';

export interface NgtObjectInputsState<TObject extends THREE.Object3D = THREE.Object3D>
  extends NgtInstanceState<TObject> {
  name: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  quaternion: THREE.Quaternion;
  scale: THREE.Vector3;
  color: THREE.Color;
  castShadow: boolean;
  receiveShadow: boolean;
  priority: number;
  visible: boolean;
  matrixAutoUpdate: boolean;
  userData?: NgtUnknownRecord;
  dispose?: (() => void) | null;
  raycast?: THREE.Object3D['raycast'] | null;
  appendMode: 'immediate' | 'root' | 'none';
  appendTo?: NgtRef<THREE.Object3D>;
}

@Directive()
export abstract class NgtObjectInputs<
  TObject extends THREE.Object3D = THREE.Object3D,
  TObjectInputsState extends NgtObjectInputsState<TObject> = NgtObjectInputsState<TObject>
> extends NgtInstance<TObject, TObjectInputsState> {
  @Input() set name(name: NgtObservableInput<string>) {
    this.set({ nameExplicit: true, name });
  }

  get name(): string {
    return this.getState((s) => s.name);
  }

  @Input() set position(position: NgtObservableInput<NgtVector3> | undefined) {
    this.set({
      positionExplicit: true,
      position: isObservable(position)
        ? position.pipe(map((v) => make(THREE.Vector3, v)))
        : make(THREE.Vector3, position),
    });
  }

  get position(): THREE.Vector3 {
    return this.getState((s) => s.position);
  }

  @Input() set rotation(rotation: NgtObservableInput<NgtEuler | NgtTriple> | undefined) {
    this.set({
      rotationExplicit: true,
      rotation: isObservable(rotation) ? rotation.pipe(map((v) => make(THREE.Euler, v))) : make(THREE.Euler, rotation),
    });
  }

  get rotation() {
    return this.getState((s) => s.rotation);
  }

  @Input() set quaternion(quaternion: NgtObservableInput<NgtQuaternion> | undefined) {
    this.set({
      quaternionExplicit: true,
      quaternion: isObservable(quaternion)
        ? quaternion.pipe(map((v) => make(THREE.Quaternion, v)))
        : make(THREE.Quaternion, quaternion),
    });
  }

  get quaternion() {
    return this.getState((s) => s.quaternion);
  }

  @Input() set scale(scale: NgtObservableInput<NgtVector3> | undefined) {
    this.set({
      scaleExplicit: true,
      scale: isObservable(scale) ? scale.pipe(map((v) => make(THREE.Vector3, v))) : make(THREE.Vector3, scale),
    });
  }

  get scale() {
    return this.getState((s) => s.scale);
  }

  @Input() set color(color: NgtObservableInput<NgtColor> | undefined) {
    this.set({
      colorExplicit: true,
      color: isObservable(color) ? color.pipe(map((v) => make(THREE.Color, v))) : make(THREE.Color, color),
    });
  }

  get color() {
    return this.getState((s) => s.color);
  }

  @Input() set castShadow(value: NgtBooleanInput) {
    this.set({
      castShadowExplicit: true,
      castShadow: coerceBoolean(value),
    });
  }

  get castShadow() {
    return this.getState((s) => s.castShadow);
  }

  @Input() set receiveShadow(value: NgtBooleanInput) {
    this.set({
      receiveShadowExplicit: true,
      receiveShadow: coerceBoolean(value),
    });
  }

  get receiveShadow() {
    return this.getState((s) => s.receiveShadow);
  }

  @Input() set priority(priority: NgtNumberInput) {
    this.set({
      priorityExplicit: true,
      priority: coerceNumber(priority),
    });
  }

  get priority() {
    return this.getState((s) => s.priority);
  }

  @Input() set visible(visible: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      visibleExplicit: true,
      visible: isObservable(visible) ? visible.pipe(map(coerceBoolean)) : coerceBoolean(visible),
    });
  }

  get visible() {
    return this.getState((s) => s.visible);
  }

  @Input() set matrixAutoUpdate(matrixAutoUpdate: NgtBooleanInput) {
    this.set({
      matrixAutoUpdateExplicit: true,
      matrixAutoUpdate: coerceBoolean(matrixAutoUpdate),
    });
  }

  get matrixAutoUpdate() {
    return this.getState((s) => s.matrixAutoUpdate);
  }

  @Input() set userData(userData: NgtObservableInput<NgtUnknownRecord> | undefined) {
    this.set({ userDataExplicit: true, userData });
  }

  get userData() {
    return this.getState((s) => s.userData);
  }

  @Input() set dispose(dispose: (() => void) | null | undefined) {
    this.set({ disposeExplicit: true, dispose });
  }

  get dispose() {
    return this.getState((s) => s.dispose);
  }

  @Input() set raycast(raycast: THREE.Object3D['raycast'] | null | undefined) {
    this.set({ raycastExplicit: true, raycast });
  }

  get raycast() {
    return this.getState((s) => s.raycast);
  }

  @Input() set appendMode(appendMode: 'immediate' | 'root' | 'none') {
    this.set({ appendModeExplicit: true, appendMode });
  }

  get appendMode() {
    return this.getState((s) => s.appendMode);
  }

  @Input() set appendTo(appendTo: NgtRef<THREE.Object3D> | THREE.Object3D | undefined) {
    this.set({
      appendToExplicit: true,
      appendTo: appendTo ? (is.ref(appendTo) ? appendTo : new NgtRef(appendTo)) : undefined,
    });
  }

  get appendTo() {
    return this.getState((s) => s.appendTo);
  }

  // events
  @Output() click = new EventEmitter<NgtThreeEvent<MouseEvent>>();
  @Output() contextmenu = new EventEmitter<NgtThreeEvent<MouseEvent>>();
  @Output() dblclick = new EventEmitter<NgtThreeEvent<MouseEvent>>();
  @Output() pointerup = new EventEmitter<NgtThreeEvent<PointerEvent>>();
  @Output() pointerdown = new EventEmitter<NgtThreeEvent<PointerEvent>>();
  @Output() pointerover = new EventEmitter<NgtThreeEvent<PointerEvent>>();
  @Output() pointerout = new EventEmitter<NgtThreeEvent<PointerEvent>>();
  @Output() pointerenter = new EventEmitter<NgtThreeEvent<PointerEvent>>();
  @Output() pointerleave = new EventEmitter<NgtThreeEvent<PointerEvent>>();
  @Output() pointermove = new EventEmitter<NgtThreeEvent<PointerEvent>>();
  @Output() pointermissed = new EventEmitter<NgtThreeEvent<PointerEvent>>();
  @Output() pointercancel = new EventEmitter<NgtThreeEvent<PointerEvent>>();
  @Output() wheel = new EventEmitter<NgtThreeEvent<WheelEvent>>();

  override get optionsFields() {
    return [
      ...super.optionsFields,
      'name',
      'position',
      'rotation',
      'quaternion',
      'scale',
      'color',
      'castShadow',
      'receiveShadow',
      'visible',
      'matrixAutoUpdate',
      'userData',
      'dispose',
      'raycast',
    ];
  }

  override parentRef = injectObjectRef({
    optional: true,
    skipSelf: true,
  });

  override parentHostRef = injectObjectHostRef({
    optional: true,
    skipSelf: true,
  });

  override initialize() {
    super.initialize();
    this.set({
      name: '',
      position: new THREE.Vector3(),
      rotation: new THREE.Euler(),
      quaternion: new THREE.Quaternion(),
      scale: new THREE.Vector3(1, 1, 1),
      color: new THREE.Color(),
      castShadow: false,
      receiveShadow: false,
      visible: true,
      matrixAutoUpdate: true,
      userData: {},
      dispose: null,
      priority: 0,
      appendMode: 'immediate',
    });
  }
}
