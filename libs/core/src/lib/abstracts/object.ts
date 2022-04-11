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
import { NgtStore } from '../stores/store';
import { NGT_OBJECT_FACTORY } from '../tokens';
import type {
    AnyFunction,
    BooleanInput,
    NgtColor,
    NgtEuler,
    NgtEvent,
    NgtEventHandlers,
    NgtQuaternion,
    NgtRenderState,
    NgtUnknownInstance,
    NgtVector3,
    UnknownRecord,
} from '../types';
import { applyProps } from '../utils/apply-props';
import { coerceBooleanProperty } from '../utils/coercion';
import { make, makeColor, makeVector3 } from '../utils/make';
import { NgtInstance, NgtInstanceState } from './instance';

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

export interface NgtObjectState<TObject extends THREE.Object3D = THREE.Object3D>
    extends NgtInstanceState<TObject> {
    object3d: TObject;
    name: string;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    quaternion: THREE.Quaternion;
    scale: THREE.Vector3;
    color: THREE.Color;
    castShadow: boolean;
    receiveShadow: boolean;
    priority: number;
    useHostParent: boolean;
    visible: boolean;
    matrixAutoUpdate: boolean;
    appendMode: 'immediate' | 'root' | 'none';
    userData?: UnknownRecord;
    dispose?: (() => void) | null;
    raycast?: THREE.Object3D['raycast'] | null;
    appendTo?: () => THREE.Object3D;
}

@Directive()
export abstract class NgtObject<
    TObject extends THREE.Object3D = THREE.Object3D,
    TObjectState extends NgtObjectState<TObject> = NgtObjectState<TObject>
> extends NgtInstance<TObject, TObjectState> {
    @Input() set name(name: string) {
        this.set({ name } as Partial<TObjectState>);
    }

    @Input() set position(position: NgtVector3 | undefined) {
        this.set({ position: makeVector3(position) } as Partial<TObjectState>);
    }

    @Input() set rotation(rotation: NgtEuler | undefined) {
        this.set({
            rotation: make(THREE.Euler, rotation),
        } as Partial<TObjectState>);
    }

    @Input() set quaternion(quaternion: NgtQuaternion | undefined) {
        this.set({
            quaternion: make(THREE.Quaternion, quaternion),
        } as Partial<TObjectState>);
    }

    @Input() set scale(scale: NgtVector3 | undefined) {
        this.set({ scale: makeVector3(scale) } as Partial<TObjectState>);
    }

    @Input() set color(color: NgtColor | undefined) {
        this.set({ color: makeColor(color) } as Partial<TObjectState>);
    }

    @Input() set castShadow(value: BooleanInput) {
        this.set({
            castShadow: coerceBooleanProperty(value),
        } as Partial<TObjectState>);
    }

    @Input() set receiveShadow(value: BooleanInput) {
        this.set({
            receiveShadow: coerceBooleanProperty(value),
        } as Partial<TObjectState>);
    }

    @Input() set priority(priority: number) {
        this.set({ priority } as Partial<TObjectState>);
    }
    @Input() set useHostParent(useHostParent: boolean) {
        this.set({ useHostParent } as Partial<TObjectState>);
    }
    @Input() set visible(visible: boolean) {
        this.set({ visible } as Partial<TObjectState>);
    }
    @Input() set matrixAutoUpdate(matrixAutoUpdate: boolean) {
        this.set({ matrixAutoUpdate } as Partial<TObjectState>);
    }

    @Input() set userData(userData: UnknownRecord) {
        this.set({ userData } as Partial<TObjectState>);
    }

    @Input() set dispose(dispose: (() => void) | null) {
        this.set({ dispose } as Partial<TObjectState>);
    }

    @Input() set raycast(raycast: THREE.Object3D['raycast'] | null) {
        this.set({ raycast } as Partial<TObjectState>);
    }

    @Input() set appendMode(appendMode: 'immediate' | 'root' | 'none') {
        this.set({ appendMode } as Partial<TObjectState>);
    }

    @Input() set appendTo(appendTo: () => THREE.Object3D) {
        this.set({ appendTo } as Partial<TObjectState>);
    }

    private _reconstruct = false;
    get reconstruct(): boolean {
        return this._reconstruct;
    }
    @Input() set reconstruct(reconstruct: BooleanInput) {
        this._reconstruct = coerceBooleanProperty(reconstruct);
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
        @Inject(NGT_OBJECT_FACTORY)
        protected parentObjectFactory: AnyFunction
    ) {
        super({ zone, store, parentInstanceFactory: parentObjectFactory });
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
            useHostParent: false,
            visible: true,
            matrixAutoUpdate: true,
            appendMode: 'immediate' as const,
            userData: {},
        } as Partial<TObjectState>);
    }

    get object3d(): TObject {
        return this.get((s) => s.object3d) as TObject;
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

    private init(reconstruct = false) {
        if (reconstruct !== this.reconstruct) {
            reconstruct = this.reconstruct;
        }

        if (this.object3d && reconstruct) {
            this.switch();
        } else {
            this.prepareInstance(this.objectInitFn(), 'object3d');
        }

        if (this.object3d) {
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
                this.store.addInteraction(this.object3d);
            }

            // append to parent
            if (
                this.object3d.isObject3D &&
                this.get((s) => s.appendMode) !== 'none'
            ) {
                // appendToParent is late a frame due to appendTo
                // only emit the object is ready after it's been added to the scene
                this.appendToParent();
            }

            // setup beforeRender
            if (this.beforeRender.observed) {
                this.store.registerBeforeRender({
                    obj: () => this.object3d,
                    callback: (state) => {
                        this.beforeRender.emit({
                            state,
                            object: this.object3d,
                        });
                    },
                    priority: this.get((s) => s.priority),
                });
            }
        }
    }

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

    protected override destroy() {
        if (this.object3d) {
            // remove beforeRender callback
            this.store.unregisterBeforeRender(this.object3d.uuid);

            // remove interaction
            if (this.__ngt__.eventCount > 0) {
                this.store.removeInteraction(this.object3d.uuid);
            }

            this.remove();
        }
        super.destroy();
    }

    private appendToParent(): void {
        requestAnimationFrame(() => {
            const appendToFactory = this.get((s) => s.appendTo);
            const appendTo = appendToFactory?.();
            if (appendTo) {
                appendTo.add(this.object3d);
                this.appended.emit(this.object3d);
                return;
            }

            const appendMode = this.get((s) => s.appendMode);

            if (appendMode === 'root') {
                this.addToScene();
                this.appended.emit(this.object3d);
                return;
            }

            if (appendMode === 'immediate') {
                this.addToParent();
                this.appended.emit(this.object3d);
            }
        });
    }

    private addToScene() {
        const scene = this.store.get((s) => s.scene);
        if (scene) {
            scene.add(this.object3d);
        }
    }

    private addToParent() {
        const parentObject = this.parentObjectFactory?.() as THREE.Object3D;

        // if (this.useHostParent) {
        //     parentObject = this.hostParentObjectFn?.();
        // }

        if (parentObject && parentObject.uuid !== this.object3d.uuid) {
            parentObject.add(this.object3d);
        } else {
            this.addToScene();
        }
    }

    private remove() {
        const { appendMode, appendToFactory } = this.get();
        const appendTo = appendToFactory?.();
        if (appendTo) {
            appendTo.remove(this.object3d);
        } else if (
            this.parentObjectFactory?.() &&
            this.parentObjectFactory()?.uuid !== this.object3d.uuid &&
            appendMode === 'immediate'
        ) {
            this.parentObjectFactory().remove(this.object3d);
        } else {
            const scene = this.store.get((s) => s.scene);
            if (scene) {
                scene.remove(this.object3d);
            }
        }
    }

    private switch() {
        const newObject3d = this.prepareInstance(this.objectInitFn());
        if (this.object3d.children) {
            this.object3d.traverse((object) => {
                if (
                    object !== this.object3d &&
                    object.parent === this.object3d
                ) {
                    object.parent = newObject3d;
                }
            });
            this.object3d.children = [];
        }

        if (this.__ngt__.eventCount > 0) {
            this.store.removeInteraction(this.object3d.uuid);
        }

        this.remove();
        this.set({
            object: newObject3d,
            instance: newObject3d,
        } as unknown as Partial<TObjectState>);
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
