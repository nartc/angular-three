import { Directive, EventEmitter, Input, Output } from '@angular/core';
import * as THREE from 'three';
import { injectObjectHostRef, injectObjectRef } from '../di/object';
import { NgtRef } from '../ref';
import type {
  BooleanInput,
  NgtBeforeRender,
  NgtColor,
  NgtEuler,
  NgtEventHandlers,
  NgtInstanceNode,
  NgtQuaternion,
  NgtThreeEvent,
  NgtTriple,
  NgtVector3,
  NumberInput,
  UnknownRecord,
} from '../types';
import { applyProps } from '../utils/apply-props';
import { coerceBooleanProperty, coerceNumberProperty } from '../utils/coercion';
import { createNgtProvider } from '../utils/inject';
import { is } from '../utils/is';
import { make } from '../utils/make';
import { NgtInstance, NgtInstanceState, provideNgtInstance } from './instance';

const supportedEvents = [
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
] as const;

export interface NgtObjectInputsState<
  TObject extends THREE.Object3D = THREE.Object3D
> extends NgtInstanceState<TObject> {
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
  appendMode: 'immediate' | 'root' | 'none';
  userData?: UnknownRecord;
  dispose?: (() => void) | null;
  raycast?: THREE.Object3D['raycast'] | null;
  appendTo?: NgtRef<THREE.Object3D>;
}

@Directive()
export abstract class NgtObjectInputs<
  TObject extends THREE.Object3D = THREE.Object3D,
  TObjectInputsState extends NgtObjectInputsState<TObject> = NgtObjectInputsState<TObject>
> extends NgtInstance<TObject, TObjectInputsState> {
  @Input() set name(name: string) {
    this.set({ nameExplicit: true, name });
  }
  get name(): string {
    return this.get((s) => s.name);
  }

  @Input() set position(position: NgtVector3 | undefined) {
    this.set({
      positionExplicit: true,
      position: make(THREE.Vector3, position),
    });
  }
  get position(): THREE.Vector3 {
    return this.get((s) => s.position);
  }

  @Input() set rotation(rotation: NgtEuler | NgtTriple | undefined) {
    this.set({ rotationExplicit: true, rotation: make(THREE.Euler, rotation) });
  }
  get rotation() {
    return this.get((s) => s.rotation);
  }

  @Input() set quaternion(quaternion: NgtQuaternion | undefined) {
    this.set({
      quaternionExplicit: true,
      quaternion: make(THREE.Quaternion, quaternion),
    });
  }
  get quaternion() {
    return this.get((s) => s.quaternion);
  }

  @Input() set scale(scale: NgtVector3 | undefined) {
    this.set({ scaleExplicit: true, scale: make(THREE.Vector3, scale) });
  }
  get scale() {
    return this.get((s) => s.scale);
  }

  @Input() set color(color: NgtColor | undefined) {
    this.set({ colorExplicit: true, color: make(THREE.Color, color) });
  }
  get color() {
    return this.get((s) => s.color);
  }

  @Input() set castShadow(value: BooleanInput) {
    this.set({
      castShadowExplicit: true,
      castShadow: coerceBooleanProperty(value),
    });
  }
  get castShadow() {
    return this.get((s) => s.castShadow);
  }

  @Input() set receiveShadow(value: BooleanInput) {
    this.set({
      receiveShadowExplicit: true,
      receiveShadow: coerceBooleanProperty(value),
    });
  }
  get receiveShadow() {
    return this.get((s) => s.receiveShadow);
  }

  @Input() set priority(priority: NumberInput) {
    this.set({
      priorityExplicit: true,
      priority: coerceNumberProperty(priority),
    });
  }
  get priority() {
    return this.get((s) => s.priority);
  }

  @Input() set visible(visible: BooleanInput) {
    this.set({
      visibleExplicit: true,
      visible: coerceBooleanProperty(visible),
    });
  }
  get visible() {
    return this.get((s) => s.visible);
  }

  @Input() set matrixAutoUpdate(matrixAutoUpdate: BooleanInput) {
    this.set({
      matrixAutoUpdateExplicit: true,
      matrixAutoUpdate: coerceBooleanProperty(matrixAutoUpdate),
    });
  }
  get matrixAutoUpdate() {
    return this.get((s) => s.matrixAutoUpdate);
  }

  @Input() set userData(userData: UnknownRecord | undefined) {
    this.set({ userDataExplicit: true, userData });
  }
  get userData() {
    return this.get((s) => s.userData);
  }

  @Input() set dispose(dispose: (() => void) | null | undefined) {
    this.set({ disposeExplicit: true, dispose });
  }
  get dispose() {
    return this.get((s) => s.dispose);
  }

  @Input() set raycast(raycast: THREE.Object3D['raycast'] | null | undefined) {
    this.set({ raycastExplicit: true, raycast });
  }
  get raycast() {
    return this.get((s) => s.raycast);
  }

  @Input() set appendMode(appendMode: 'immediate' | 'root' | 'none') {
    this.set({ appendModeExplicit: true, appendMode });
  }
  get appendMode() {
    return this.get((s) => s.appendMode);
  }

  @Input() set appendTo(
    appendTo: NgtRef<THREE.Object3D> | THREE.Object3D | undefined
  ) {
    this.set({
      appendToExplicit: true,
      appendTo: appendTo
        ? is.ref(appendTo)
          ? appendTo
          : new NgtRef(appendTo)
        : undefined,
    });
  }
  get appendTo() {
    return this.get((s) => s.appendTo);
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

  shouldPassThroughRef = true;

  protected override get optionsFields(): Record<string, boolean> {
    return {
      name: false,
      position: false,
      rotation: false,
      quaternion: false,
      scale: false,
      color: false,
      castShadow: false,
      receiveShadow: false,
      visible: false,
      matrixAutoUpdate: false,
      userData: false,
      dispose: true,
      raycast: true,
    };
  }

  protected override parentRef = injectObjectRef({
    optional: true,
    skipSelf: true,
  });
  protected override parentHostRef = injectObjectHostRef({
    optional: true,
    skipSelf: true,
  });

  override preInit() {
    this.set((s) => ({
      name: s.name || '',
      position: s.position || new THREE.Vector3(),
      rotation: s.rotation || new THREE.Euler(),
      quaternion: s.quaternion || new THREE.Quaternion(),
      scale: s.scale || new THREE.Vector3(1, 1, 1),
      color: s.color || new THREE.Color(),
      castShadow: s.castShadow ?? false,
      receiveShadow: s.receiveShadow ?? false,
      visible: s.visible ?? true,
      matrixAutoUpdate: s.matrixAutoUpdate ?? true,
      userData: s.userData ?? {},
      dispose: s.dispose ?? null,
      priority: s.priority ?? 0,
      appendMode: s.appendMode ?? 'immediate',
    }));
  }
}

@Directive()
export abstract class NgtObject<
  TObject extends THREE.Object3D = THREE.Object3D,
  TObjectState extends NgtObjectInputsState<TObject> = NgtObjectInputsState<TObject>
> extends NgtObjectInputs<TObject, TObjectState> {
  @Output() appended = new EventEmitter<TObject>();
  @Output() beforeRender = new EventEmitter<NgtBeforeRender<TObject>>();

  protected override initFn(
    prepareInstance: (
      instance: TObject,
      uuid?: string
    ) => NgtInstanceNode<TObject>
  ): (() => void) | void | undefined {
    if (this.instanceValue && this.__ngt__) {
      this.#switch(prepareInstance);
    } else {
      prepareInstance(this.instanceInitFn(), this.instanceValue?.uuid);
    }

    if (this.instanceValue) {
      const observedEvents = supportedEvents.reduce(
        (result, event) => {
          const controllerEvent = this[event].observed ? this[event] : null;
          if (controllerEvent) {
            result.handlers[event] = this.#eventNameToHandler(
              controllerEvent as EventEmitter<NgtThreeEvent<any>>
            );
            result.eventCount += 1;
          }
          return result;
        },
        { handlers: {}, eventCount: 0 } as {
          handlers: NgtEventHandlers;
          eventCount: number;
        }
      );

      // patch __ngt__ with events
      applyProps(this.__ngt__, observedEvents);

      // add as an interaction if there are events observed
      if (observedEvents.eventCount > 0) {
        this.store.addInteraction(this.instanceValue);
      }

      // append to parent
      if (is.object3d(this.instanceValue)) {
        this.#appendToParent();
      }

      // setup beforeRender
      if (this.beforeRender.observed) {
        this.store.registerBeforeRender({
          obj: this.instance,
          callback: (state) => {
            this.beforeRender.emit({ state, object: this.instanceValue });
          },
          priority: this.get((s) => s.priority),
        });
      }
    }

    return () => {
      this.destroy();
    };
  }

  protected abstract instanceInitFn: () => TObject;

  #switch(prepareInstance: (instance: TObject) => NgtInstanceNode<TObject>) {
    const newObject3d = this.instanceInitFn();
    if (this.instanceValue.children) {
      this.instanceValue.traverse((object) => {
        if (
          object !== this.instanceValue &&
          object.parent === this.instanceValue
        ) {
          object.parent = newObject3d;
        }
      });
      this.instanceValue.children = [];
    }

    if (this.__ngt__.eventCount > 0) {
      this.store.removeInteraction(this.instanceValue.uuid);
    }

    this.#remove();
    prepareInstance(newObject3d);
  }

  #appendToParent(): void {
    // appendToParent is late a frame due to appendTo
    // only emit the object is ready after it's been added to the scene
    const callback = () => {
      const appendToRef = this.get((s) => s.appendTo);
      if (appendToRef && appendToRef.value) {
        appendToRef.value.add(this.instanceValue);
        this.appended.emit(this.instanceValue);
        return;
      }

      const appendMode = this.get((s) => s.appendMode);

      if (appendMode === 'none') return;

      if (appendMode === 'root') {
        this.#addToScene();
        this.appended.emit(this.instanceValue);
        return;
      }

      if (appendMode === 'immediate') {
        this.#addToParent();
        this.appended.emit(this.instanceValue);
      }
    };

    const gl = this.store.get((s) => s.gl);
    if (gl.xr.enabled) {
      gl.xr.getSession()?.requestAnimationFrame(callback);
    } else {
      requestAnimationFrame(callback);
    }
  }

  #addToScene() {
    const scene = this.store.get((s) => s.scene);
    if (scene) {
      scene.add(this.instanceValue);
    }
  }

  #addToParent() {
    let parent = this.parent;
    if (this.#shouldUseParent(parent)) {
      parent.value.add(this.instanceValue);
      return;
    }

    parent = this.parentHostRef?.();
    if (this.#shouldUseParent(parent)) {
      parent.value.add(this.instanceValue);
      return;
    }

    this.#addToScene();
  }

  #remove() {
    const { appendMode, appendTo } = this.get();
    if (appendTo && appendTo.value) {
      appendTo.value.remove(this.instanceValue);
    } else if (
      this.#shouldUseParent(this.parent) &&
      appendMode === 'immediate'
    ) {
      this.parent.value.remove(this.instanceValue);
    } else {
      const scene = this.store.get((s) => s.scene);
      if (scene) {
        scene.remove(this.instanceValue);
      }
    }
  }

  #shouldUseParent(parent: NgtRef<NgtInstanceNode<THREE.Object3D>>) {
    return (
      parent && parent.value && parent.value.uuid !== this.instanceValue.uuid
    );
  }

  #eventNameToHandler(
    controllerEvent:
      | EventEmitter<NgtThreeEvent<PointerEvent>>
      | EventEmitter<NgtThreeEvent<WheelEvent>>
  ) {
    return (
      event: Parameters<
        Exclude<NgtEventHandlers[typeof supportedEvents[number]], undefined>
      >[0]
    ) => {
      // go back into Angular Zone so that state updates on these events trigger CD
      this.zone.run(() => {
        controllerEvent.emit(event as NgtThreeEvent<any>);
      });
    };
  }

  protected override destroy() {
    if (this.instance.value) {
      // remove beforeRender callback
      this.store.unregisterBeforeRender(this.instanceValue.uuid);

      // remove interaction
      if (this.__ngt__.eventCount > 0) {
        this.store.removeInteraction(this.instanceValue.uuid);
      }

      this.#remove();
    }
    super.destroy();
  }
}

export const provideNgtObject = createNgtProvider(
  NgtObject,
  provideNgtInstance
);
