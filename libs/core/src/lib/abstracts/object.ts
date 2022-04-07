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
import { Observable, of, Subscription, tap } from 'rxjs';
import * as THREE from 'three';
import { NGT_INSTANCE_FACTORY } from '../di/instance';
import { startWithUndefined } from '../stores/component-store';
import { NgtStore } from '../stores/store';
import type {
    AnyFunction,
    BooleanInput,
    NgtColor,
    NgtEuler,
    NgtEvent,
    NgtEventHandlers,
    NgtInstanceInternal,
    NgtQuaternion,
    NgtRenderState,
    NgtVector3,
    UnknownRecord,
} from '../types';
import { applyProps } from '../utils/apply-props';
import { coerceBooleanProperty } from '../utils/coercion';
import { prepare } from '../utils/instance';
import { makeColor, makeForSet, makeVector3 } from '../utils/make';
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

export interface NgtObjectState<TObject extends THREE.Object3D = THREE.Object3D>
    extends NgtInstanceState<TObject> {
    object: TObject;
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
            rotation: makeForSet(THREE.Euler, rotation),
        } as Partial<TObjectState>);
    }

    @Input() set quaternion(quaternion: NgtQuaternion | undefined) {
        this.set({
            quaternion: makeForSet(THREE.Quaternion, quaternion),
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

    @Output() animateReady = new EventEmitter<{
        state: NgtRenderState;
        object: TObject;
    }>();

    private readonly inputs$ = this.select(
        this.select((s) => s.name),
        this.select((s) => s.position),
        this.select((s) => s.rotation),
        this.select((s) => s.quaternion),
        this.select((s) => s.scale),
        this.select((s) => s.color),
        this.select((s) => s.castShadow),
        this.select((s) => s.receiveShadow),
        this.select((s) => s.visible),
        this.select((s) => s.matrixAutoUpdate),
        this.select((s) => s.userData),
        this.select((s) => s.dispose).pipe(startWithUndefined()),
        this.select((s) => s.raycast).pipe(startWithUndefined()),
        (
            name,
            position,
            rotation,
            quaternion,
            scale,
            color,
            castShadow,
            receiveShadow,
            visible,
            matrixAutoUpdate,
            userData,
            dispose,
            raycast
        ) => ({
            name,
            position,
            rotation,
            quaternion,
            scale,
            color,
            castShadow,
            receiveShadow,
            visible,
            matrixAutoUpdate,
            userData,
            dispose,
            raycast,
        })
    );

    private initSubscription?: Subscription;
    private inputChangesSubscription?: Subscription;

    protected abstract objectInitFn(): TObject;

    constructor(
        zone: NgZone,
        protected store: NgtStore,
        @Optional()
        @SkipSelf()
        @Inject(NGT_INSTANCE_FACTORY)
        protected parentObjectFactory: AnyFunction
    ) {
        super({ zone, parentInstanceFactory: parentObjectFactory });
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

    get object(): TObject {
        return this.get((s) => s.object) as TObject;
    }

    init() {
        this.zone.runOutsideAngular(() => {
            if (this.initSubscription) {
                this.initSubscription.unsubscribe();
            }

            this.initSubscription = this.onCanvasReady(
                this.store.ready$,
                () => {
                    if (this.object) {
                        this.switch();
                    } else {
                        const object = prepare(
                            this.objectInitFn(),
                            () => this.store.get(),
                            this.parentObjectFactory?.()
                        );
                        this.set({
                            object,
                            instance: object,
                        } as unknown as Partial<TObjectState>);
                    }

                    if (this.object) {
                        if (this.inputChangesSubscription) {
                            this.inputChangesSubscription.unsubscribe();
                        }

                        this.inputChangesSubscription = this.applyCustomProps(
                            this.select(
                                this.inputs$,
                                this.subInputs$,
                                (objectInputs, subInputs) => ({
                                    objectInputs,
                                    subInputs,
                                })
                            )
                        );

                        const observedEvents = supportedEvents.reduce(
                            (result, event) => {
                                const controllerEvent = this[event].observed
                                    ? this[event]
                                    : null;
                                if (controllerEvent) {
                                    result.handlers[event] =
                                        this.eventNameToHandler(
                                            controllerEvent as EventEmitter<
                                                NgtEvent<any>
                                            >
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
                        applyProps(
                            this.__ngt__ as any,
                            {
                                handlers: observedEvents.handlers,
                                eventCount: observedEvents.eventCount,
                            } as Partial<NgtInstanceInternal>
                        );

                        // add as an interaction if there are events observed
                        if (observedEvents.eventCount > 0) {
                            this.store.addInteraction(this.object);
                        }

                        // append to parent
                        if (
                            this.object.isObject3D &&
                            this.get((s) => s.appendMode) !== 'none'
                        ) {
                            // appendToParent is late a frame due to appendTo
                            // only emit the object is ready after it's been added to the scene
                            this.appendToParent();
                        } else {
                            // the object is ready
                            this.emitReady();
                        }

                        // setup animateReady
                        if (this.animateReady.observed) {
                            this.store.register({
                                obj: () => this.object,
                                callback: (state) => {
                                    this.animateReady.emit({
                                        state,
                                        object: this.object,
                                    });
                                },
                                priority: this.get((s) => s.priority),
                            });
                        }
                    }
                }
            );
        });
    }

    protected get subInputs(): Record<string, boolean> {
        return {};
    }

    private get subInputs$(): Observable<UnknownRecord> {
        const subInputEntries = Object.entries(this.subInputs);
        if (subInputEntries.length === 0) return of({});
        return this.select(
            ...subInputEntries.map(([inputKey, shouldStartWithUndefined]) => {
                const subInput$ = this.select(
                    (s) => (s as UnknownRecord)[inputKey]
                );
                if (shouldStartWithUndefined)
                    return subInput$.pipe(startWithUndefined());
                return subInput$;
            }),
            (...args: any[]) =>
                args.reduce((record, arg, index) => {
                    record[subInputEntries[index][0]] = arg;
                    return record;
                }, {} as UnknownRecord)
        );
    }

    protected override destroy() {
        if (this.initSubscription) {
            this.initSubscription.unsubscribe();
        }

        if (this.object) {
            this.store.unregister(this.object.uuid);

            if (this.__ngt__.eventCount > 0) {
                this.store.removeInteraction(this.object.uuid);
            }

            this.remove();

            if (this.object.clear) {
                this.object.clear();
            }
        }
        super.destroy();
    }

    private appendToParent(): void {
        requestAnimationFrame(() => {
            const appendToFactory = this.get((s) => s.appendTo);
            const appendTo = appendToFactory?.();
            if (appendTo) {
                appendTo.add(this.object);
                this.emitReady();
                return;
            }

            const appendMode = this.get((s) => s.appendMode);

            if (appendMode === 'root') {
                this.addToScene();
                this.emitReady();
                return;
            }

            if (appendMode === 'immediate') {
                this.addToParent();
                this.emitReady();
            }
        });
    }

    private addToScene() {
        const scene = this.store.get((s) => s.scene);
        if (scene) {
            scene.add(this.object);
        }
    }

    private addToParent() {
        const parentObject = this.parentObjectFactory?.() as THREE.Object3D;

        // if (this.useHostParent) {
        //     parentObject = this.hostParentObjectFn?.();
        // }

        if (parentObject && parentObject.uuid !== this.object.uuid) {
            parentObject.add(this.object);
        } else {
            this.addToScene();
        }
    }

    private remove() {
        const appendMode = this.get((s) => s.appendMode);
        const appendToFactory = this.get((s) => s.appendTo);
        const appendTo = appendToFactory?.();
        if (appendTo) {
            appendTo.remove(this.object);
        } else if (
            this.parentObjectFactory?.() &&
            this.parentObjectFactory()?.uuid !== this.object.uuid &&
            appendMode === 'immediate'
        ) {
            this.parentObjectFactory().remove(this.object);
        } else {
            const scene = this.store.get((s) => s.scene);
            if (scene) {
                scene.remove(this.object);
            }
        }
    }

    private switch() {
        const newObject3d = prepare(
            this.objectInitFn(),
            () => this.store.get(),
            this.parentObjectFactory?.()
        );
        if (this.object.children) {
            this.object.traverse((object) => {
                if (object !== this.object && object.parent === this.object) {
                    object.parent = newObject3d;
                }
            });
            this.object.children = [];
        }

        if (this.__ngt__.eventCount > 0) {
            this.store.removeInteraction(this.object.uuid);
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

    private readonly applyCustomProps = this.effect<{
        objectInputs: UnknownRecord;
        subInputs: UnknownRecord;
    }>(
        tap(({ subInputs }) => {
            this.zone.runOutsideAngular(() => {
                if (this.object) {
                    const state = this.get();
                    const customProps = {} as UnknownRecord;

                    customProps['castShadow'] = state.castShadow;
                    customProps['receiveShadow'] = state.receiveShadow;
                    customProps['visible'] = state.visible;
                    customProps['matrixAutoUpdate'] = state.matrixAutoUpdate;

                    if (state.name) {
                        customProps['name'] = state.name;
                    }
                    if (state.position) {
                        customProps['position'] = state.position;
                    }
                    if (state.rotation) {
                        customProps['rotation'] = state.rotation;
                    } else if (state.quaternion) {
                        customProps['quaternion'] = state.quaternion;
                    }
                    if (state.scale) {
                        customProps['scale'] = state.scale;
                    }
                    if (state.userData) {
                        customProps['userData'] = state.userData;
                    }
                    if (state.color) {
                        customProps['color'] = state.color;
                    }
                    if (state.dispose) {
                        customProps['dispose'] = state.dispose;
                    }
                    if (state.raycast) {
                        customProps['raycast'] = state.raycast;
                    }

                    for (const subInput of Object.keys(subInputs)) {
                        if (
                            state[subInput as keyof typeof state] != undefined
                        ) {
                            customProps[subInput] =
                                state[subInput as keyof typeof state];
                        }
                    }

                    applyProps(this.object as any, customProps);
                    this.object.updateMatrix?.();
                }
            });
        })
    );
}
