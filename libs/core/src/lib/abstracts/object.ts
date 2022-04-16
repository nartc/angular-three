import {
    Directive,
    EventEmitter,
    Inject,
    Input,
    NgZone,
    Optional,
    Output,
    SkipSelf,
} from '@angular/core';
import * as THREE from 'three';
import { Ref } from '../ref';
import { NgtStore } from '../stores/store';
import { NGT_OBJECT_HOST_REF, NGT_OBJECT_REF } from '../tokens';
import type {
    BooleanInput,
    NgtColor,
    NgtEuler,
    NgtEvent,
    NgtEventHandlers,
    NgtQuaternion,
    NgtRef,
    NgtRenderState,
    NgtUnknownInstance,
    NgtVector3,
    UnknownRecord,
} from '../types';
import { applyProps } from '../utils/apply-props';
import { coerceBooleanProperty } from '../utils/coercion';
import { is } from '../utils/is';
import { make, makeColor, makeVector3 } from '../utils/make';
import type { NgtInstanceState } from './instance';
import { NgtInstance } from './instance';

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

export type NgtPreObjectInit = ((initFn: () => void) => void) | undefined;

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
    appendTo?: Ref<THREE.Object3D>;
}

@Directive()
export abstract class NgtObjectInputs<
    TObject extends THREE.Object3D = THREE.Object3D,
    TObjectInputsState extends NgtObjectInputsState<TObject> = NgtObjectInputsState<TObject>
> extends NgtInstance<TObject, TObjectInputsState> {
    @Input() set name(name: string) {
        this.set({ name } as Partial<TObjectInputsState>);
    }
    get name(): string {
        return this.get((s) => s.name);
    }

    @Input() set position(position: NgtVector3 | undefined) {
        this.set({
            position: makeVector3(position),
        } as Partial<TObjectInputsState>);
    }
    get position(): THREE.Vector3 {
        return this.get((s) => s.position);
    }

    get rotation() {
        return this.get((s) => s.rotation);
    }
    @Input() set rotation(rotation: NgtEuler | undefined) {
        this.set({
            rotation: make(THREE.Euler, rotation),
        } as Partial<TObjectInputsState>);
    }

    get quaternion() {
        return this.get((s) => s.quaternion);
    }
    @Input() set quaternion(quaternion: NgtQuaternion | undefined) {
        this.set({
            quaternion: make(THREE.Quaternion, quaternion),
        } as Partial<TObjectInputsState>);
    }

    get scale() {
        return this.get((s) => s.scale);
    }
    @Input() set scale(scale: NgtVector3 | undefined) {
        this.set({ scale: makeVector3(scale) } as Partial<TObjectInputsState>);
    }

    get color() {
        return this.get((s) => s.color);
    }
    @Input() set color(color: NgtColor | undefined) {
        this.set({ color: makeColor(color) } as Partial<TObjectInputsState>);
    }

    get castShadow() {
        return this.get((s) => s.castShadow);
    }
    @Input() set castShadow(value: BooleanInput) {
        this.set({
            castShadow: coerceBooleanProperty(value),
        } as Partial<TObjectInputsState>);
    }

    get receiveShadow() {
        return this.get((s) => s.receiveShadow);
    }
    @Input() set receiveShadow(value: BooleanInput) {
        this.set({
            receiveShadow: coerceBooleanProperty(value),
        } as Partial<TObjectInputsState>);
    }

    get priority() {
        return this.get((s) => s.priority);
    }
    @Input() set priority(priority: number) {
        this.set({ priority } as Partial<TObjectInputsState>);
    }

    get visible() {
        return this.get((s) => s.visible);
    }
    @Input() set visible(visible: boolean) {
        this.set({ visible } as Partial<TObjectInputsState>);
    }
    get matrixAutoUpdate() {
        return this.get((s) => s.matrixAutoUpdate);
    }
    @Input() set matrixAutoUpdate(matrixAutoUpdate: boolean) {
        this.set({ matrixAutoUpdate } as Partial<TObjectInputsState>);
    }

    get userData() {
        return this.get((s) => s.userData);
    }
    @Input() set userData(userData: UnknownRecord | undefined) {
        this.set({ userData } as Partial<TObjectInputsState>);
    }

    get dispose() {
        return this.get((s) => s.dispose);
    }
    @Input() set dispose(dispose: (() => void) | null | undefined) {
        this.set({ dispose } as Partial<TObjectInputsState>);
    }

    get raycast() {
        return this.get((s) => s.raycast);
    }
    @Input() set raycast(
        raycast: THREE.Object3D['raycast'] | null | undefined
    ) {
        this.set({ raycast } as Partial<TObjectInputsState>);
    }

    get appendMode() {
        return this.get((s) => s.appendMode);
    }
    @Input() set appendMode(appendMode: 'immediate' | 'root' | 'none') {
        this.set({ appendMode } as Partial<TObjectInputsState>);
    }

    get appendTo() {
        return this.get((s) => s.appendTo);
    }
    @Input() set appendTo(appendTo: Ref<THREE.Object3D> | undefined) {
        this.set({ appendTo } as Partial<TObjectInputsState>);
    }

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

    protected override get optionFields(): Record<string, boolean> {
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
}

@Directive()
export abstract class NgtObject<
    TObject extends THREE.Object3D = THREE.Object3D,
    TObjectState extends NgtObjectInputsState<TObject> = NgtObjectInputsState<TObject>
> extends NgtObjectInputs<TObject, TObjectState> {
    @Output() appended = new EventEmitter<TObject>();
    @Output() beforeRender = new EventEmitter<{
        state: NgtRenderState;
        object: TObject;
    }>();
    /**
     * @deprecated Use {@link beforeRender} instead
     */
    @Output() animateReady = this.beforeRender;

    protected abstract objectInitFn(): TObject;

    constructor(
        zone: NgZone,
        store: NgtStore,
        @Optional()
        @SkipSelf()
        @Inject(NGT_OBJECT_REF)
        protected parentObjectRef: NgtRef<THREE.Object3D>,
        @Optional()
        @SkipSelf()
        @Inject(NGT_OBJECT_HOST_REF)
        protected parentObjectHostRef: NgtRef<THREE.Object3D>
    ) {
        super(zone, store, parentObjectRef, parentObjectHostRef);
        this.set({
            name: '',
            position: new THREE.Vector3(),
            rotation: new THREE.Euler(),
            quaternion: new THREE.Quaternion(),
            scale: new THREE.Vector3(1, 1, 1),
            color: new THREE.Color(),
            castShadow: false,
            receiveShadow: false,
            priority: 0,
            visible: true,
            matrixAutoUpdate: true,
            appendMode: 'immediate' as const,
            userData: {},
        } as Partial<TObjectState>);
    }

    override ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                if (this.preObjectInit) {
                    this.preObjectInit(() => this.init());
                } else {
                    this.init();
                }
            });
        });
        super.ngOnInit();
    }

    /**
     * Sub-classes can use this function to add additional logic BEFORE
     * initializing the object3d. The actual `initFn` is passed in so
     * the implementor needs to call this initFn() manually.
     *
     * This function is also called outside of Angular Zone
     * @protected
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected get preObjectInit(): NgtPreObjectInit {
        return undefined;
    }

    private init() {
        if (this.instance.value && this.__ngt__) {
            this.switch();
        } else {
            this.prepareInstance(
                this.objectInitFn(),
                this.instance?.value?.uuid
            );
        }

        if (this.instance.value) {
            const observedEvents = supportedEvents.reduce(
                (result, event) => {
                    const controllerEvent = this[event].observed
                        ? this[event]
                        : null;
                    if (controllerEvent) {
                        result.handlers[event] = this.eventNameToHandler(
                            controllerEvent as EventEmitter<NgtEvent<any>>
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
            applyProps(this.__ngt__ as unknown as NgtUnknownInstance, {
                handlers: observedEvents.handlers,
                eventCount: observedEvents.eventCount,
            });

            // add as an interaction if there are events observed
            if (observedEvents.eventCount > 0) {
                this.store.addInteraction(this.instance.value);
            }

            // append to parent
            if (
                is.object3d(this.instance.value) &&
                this.get((s) => s.appendMode) !== 'none'
            ) {
                // appendToParent is late a frame due to appendTo
                // only emit the object is ready after it's been added to the scene
                this.appendToParent();
            }

            // setup beforeRender
            if (this.beforeRender.observed) {
                this.store.registerBeforeRender({
                    obj: () => this.instance.value,
                    callback: (state) => {
                        this.beforeRender.emit({
                            state,
                            object: this.instance.value,
                        });
                    },
                    priority: this.get((s) => s.priority),
                });
            }
        }
    }

    protected override destroy() {
        if (this.instance.value) {
            // remove beforeRender callback
            this.store.unregisterBeforeRender(this.instance.value.uuid);

            // remove interaction
            if (this.__ngt__.eventCount > 0) {
                this.store.removeInteraction(this.instance.value.uuid);
            }

            this.remove();
        }
        super.destroy();
    }

    private appendToParent(): void {
        requestAnimationFrame(() => {
            const appendToRef = this.get((s) => s.appendTo);
            if (appendToRef && appendToRef.value) {
                appendToRef.value.add(this.instance.value);
                this.appended.emit(this.instance.value);
                return;
            }

            const appendMode = this.get((s) => s.appendMode);

            if (appendMode === 'root') {
                this.addToScene();
                this.appended.emit(this.instance.value);
                return;
            }

            if (appendMode === 'immediate') {
                this.addToParent();
                this.appended.emit(this.instance.value);
            }
        });
    }

    private addToScene() {
        const scene = this.store.get((s) => s.scene);
        if (scene) {
            scene.add(this.instance.value);
        }
    }

    private addToParent() {
        if (
            this.parent &&
            this.parent.value &&
            this.parent.value.uuid !== this.instance.value.uuid
        ) {
            this.parent.value.add(this.instance.value);
        } else {
            this.addToScene();
        }
    }

    private remove() {
        const { appendMode, appendTo } = this.get();
        if (appendTo && appendTo.value) {
            appendTo.value.remove(this.instance.value);
        } else if (
            this.parent &&
            this.parent.value &&
            this.parent.value.uuid !== this.instance.value.uuid &&
            appendMode === 'immediate'
        ) {
            this.parent.value.remove(this.instance.value);
        } else {
            const scene = this.store.get((s) => s.scene);
            if (scene) {
                scene.remove(this.instance.value);
            }
        }
    }

    private switch() {
        const newObject3d = this.objectInitFn();
        if (this.instance.value.children) {
            this.instance.value.traverse((object) => {
                if (
                    object !== this.instance.value &&
                    object.parent === this.instance.value
                ) {
                    object.parent = newObject3d;
                }
            });
            this.instance.value.children = [];
        }

        if (this.__ngt__.eventCount > 0) {
            this.store.removeInteraction(this.instance.value.uuid);
        }

        this.remove();
        this.prepareInstance(newObject3d);
    }

    private eventNameToHandler(
        controllerEvent:
            | EventEmitter<NgtEvent<PointerEvent>>
            | EventEmitter<NgtEvent<WheelEvent>>
    ) {
        return (
            event: Parameters<
                Exclude<
                    NgtEventHandlers[typeof supportedEvents[number]],
                    undefined
                >
            >[0]
        ) => {
            this.zone.run(() => {
                controllerEvent.emit(event as NgtEvent<any>);
            });
        };
    }
}
