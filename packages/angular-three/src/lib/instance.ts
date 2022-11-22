import {
    Directive,
    EventEmitter,
    inject,
    InjectionToken,
    InjectOptions,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { filter, Subscription, tap } from 'rxjs';
import { NgtRef } from './ref';
import { NgtComponentStore, tapEffect } from './stores/component-store';
import { NgtStore } from './stores/store';
import type {
    NgtAnyCtor,
    NgtAnyFunction,
    NgtAnyRecord,
    NgtAttachFunction,
    NgtBeforeRenderCallback,
    NgtEventHandlers,
    NgtInstanceLocalState,
    NgtObservableInput,
    NgtThreeEvent,
} from './types';
import { applyProps } from './utils/apply-props';
import { removeInteractivity } from './utils/events';
import { getInstanceLocalState } from './utils/get-instance-local-state';
import { invalidateInstance } from './utils/instance';
import { is } from './utils/is';
import { mutate } from './utils/mutate';

export const NGT_INSTANCE_REF_FACTORY = new InjectionToken<NgtAnyFunction<NgtRef>>('NgtInstance[instanceRef] factory');
export function provideInstanceRef<
    TInstanceType extends object = any,
    TCtor extends NgtAnyCtor<TInstanceType> = NgtAnyCtor<TInstanceType>
>(ctor: TCtor, factory?: (instance: InstanceType<TCtor>) => NgtRef) {
    return {
        provide: NGT_INSTANCE_REF_FACTORY,
        useFactory: (instance: InstanceType<TCtor>) => {
            if (factory) {
                return () => factory(instance);
            }

            return () =>
                (instance as NgtAnyRecord)['instanceRef'] || (instance as NgtAnyRecord)['instance']['instanceRef'];
        },
        deps: [ctor],
    };
}

export function injectInstanceRef(): NgtAnyFunction<NgtRef>;
export function injectInstanceRef(options: InjectOptions & { optional?: false }): NgtAnyFunction<NgtRef>;
export function injectInstanceRef(options: InjectOptions & { optional?: true }): NgtAnyFunction<NgtRef> | null;
export function injectInstanceRef(options: InjectOptions = {}) {
    return inject(NGT_INSTANCE_REF_FACTORY, options);
}

export interface NgtInstanceState<TInstance extends object = NgtAnyRecord> {
    instanceRef: NgtRef<TInstance>;
    instanceArgs: unknown[];
    attach: string[] | NgtAttachFunction;
    noAttach: boolean;
    skipWrapper: boolean;
    skipInit: boolean;
}

export function injectInstance<T extends object>(): NgtInstance<T>;
export function injectInstance<T extends object>(options: InjectOptions & { optional?: false }): NgtInstance<T>;
export function injectInstance<T extends object>(options: InjectOptions & { optional?: true }): NgtInstance<T> | null;
export function injectInstance(options: InjectOptions = {}) {
    return inject(NgtInstance, options);
}

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

@Directive({
    selector: '[ngtInstance]',
    exportAs: 'ngtInstance',
    standalone: true,
})
export class NgtInstance<
        TInstance extends object = any,
        TInstanceState extends NgtInstanceState<TInstance> = NgtInstanceState<TInstance>
    >
    extends NgtComponentStore<TInstanceState>
    implements OnInit, OnDestroy
{
    @Input() set ref(instance: TInstance | NgtRef<TInstance>) {
        this.write({ instanceRef: is.ref(instance) ? instance : new NgtRef(instance) });
    }

    @Input() set skipWrapper(skipWrapper: NgtObservableInput<boolean>) {
        this.write({ skipWrapper });
        this.write({ skipWrapperExplicit: true });
    }

    @Input() set skipInit(skipInit: NgtObservableInput<boolean>) {
        this.write({ skipInit });
        this.write({ skipInitExplicit: true });
    }

    @Input() set noAttach(noAttach: NgtObservableInput<boolean>) {
        this.write({ noAttach });
        this.write({ noAttachExplicit: true });
    }

    @Input() set attach(value: string | string[] | [string, ...(string | number)[]] | NgtAttachFunction | undefined) {
        if (value) {
            const attach =
                typeof value === 'function'
                    ? value
                    : Array.isArray(value)
                    ? value.map((item) => (typeof item === 'number' ? item.toString() : item))
                    : [value];

            this.write({ attach, attachExplicit: true });
        }
    }

    @Input() priority = 0;
    @Input() beforeRender?: NgtBeforeRenderCallback<TInstance>;

    @Input() readyCallback?: ((instance: TInstance) => void) | (() => void);
    @Input() updateCallback?: ((instance: TInstance) => void) | (() => void);

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

    private readonly zone = inject(NgZone);
    private readonly store = inject(NgtStore);

    private readonly parentRef = injectInstanceRef({ skipSelf: true, optional: true });
    private _isRaw = false;

    set isRaw(val: boolean) {
        this._isRaw = val;
    }

    private hasEmittedAlready = false;

    private readonly instanceReady = this.effect(
        tapEffect(() => {
            this.handleEvents();

            let attachToParentSubscription: Subscription;
            if (this.parentRef) {
                attachToParentSubscription = this.attachToParent(this.parent!.pipe(filter((parent) => !!parent)));
            }

            let beforeRenderCleanUp: () => void;
            if (this.beforeRender && is.object3d(this.instanceValue)) {
                beforeRenderCleanUp = this.store
                    .read((s) => s.internal)
                    .subscribe(
                        (state, object) => this.beforeRender!(state, object),
                        this.priority,
                        this.store.read,
                        this.instanceValue
                    );
            }

            if (this.readyCallback) this.readyCallback(this.instanceValue);

            return () => {
                beforeRenderCleanUp?.();
                attachToParentSubscription?.unsubscribe();
            };
        })
    );

    private handleEvents = this.effect<void>(
        tapEffect(() => {
            if (this.instanceValue && is.object3d(this.instanceValue)) {
                const observedEvents = supportedEvents.reduce(
                    (result, event) => {
                        const controllerEvent = this[event].observed ? this[event] : null;
                        if (controllerEvent) {
                            result.handlers[event] = this.eventNameToHandler(
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
                    getInstanceLocalState(this.instanceValue)?.rootFactory().addInteraction(this.instanceValue);
                }
            }
            return () => {
                if (is.object3d(this.instanceValue) && this.__ngt__.eventCount > 0) {
                    getInstanceLocalState(this.instanceValue)?.rootFactory().removeInteraction(this.instanceValue.uuid);
                }
            };
        })
    );

    private readonly attachToParent = this.effect(
        tap(() => {
            const attach = this.read((s) => s.attach);

            let parentInstanceRef = this.__ngt__?.parentRef;

            // if no parentInstance, try re-run the factory due to late init
            if (!parentInstanceRef || !parentInstanceRef.value) {
                // return early if failed to retrieve
                if (!this.parent?.value) return;

                // reassign on instance internal state
                if (this.__ngt__) {
                    this.__ngt__.parentRef = this.parent;
                }
                parentInstanceRef = this.parent;
            }

            if (typeof attach === 'function') {
                const attachCleanUp = attach(parentInstanceRef, this.instanceRef, this.store.read);
                if (attachCleanUp) {
                    this.__ngt__.attach = attachCleanUp;
                }
            } else {
                const propertyToAttach = [...attach];

                // if propertyToAttach is empty
                if (propertyToAttach.length === 0) {
                    // this might be the case where we are attaching an object3D to the parent object3D
                    if (is.object3d(this.instanceValue) && is.object3d(this.parent?.value)) {
                        this.parent?.value.add(this.instanceValue);
                    }
                } else {
                    // array material handling
                    if (
                        propertyToAttach[0] === 'material' &&
                        propertyToAttach[1] &&
                        typeof Number(propertyToAttach[1]) === 'number' &&
                        is.material(this.instanceValue)
                    ) {
                        if (!Array.isArray(parentInstanceRef.value.material)) {
                            parentInstanceRef.value.material = [];
                        }
                    }

                    // retrieve the current value on the parentInstance, so we can reset it later
                    if (this.__ngt__) {
                        this.__ngt__.attachValue = propertyToAttach.reduce(
                            (value, property) => value[property],
                            parentInstanceRef.value
                        );
                    }

                    // attach the instance value on the parent
                    mutate(parentInstanceRef.value, this.instanceValue, propertyToAttach);
                }

                // validate on the instance
                invalidateInstance(this.instanceValue);

                // validate on the parent
                if (getInstanceLocalState(parentInstanceRef.value)) {
                    invalidateInstance(parentInstanceRef.value);
                }

                // save the attach
                if (this.__ngt__) {
                    this.__ngt__.attach = propertyToAttach;
                }
                this.write({ attach: propertyToAttach });
            }
        })
    );

    override initialize() {
        super.initialize();
        this.write({
            instanceRef: new NgtRef(null),
            attach: [],
            noAttach: false,
            skipWrapper: false,
            skipInit: false,
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.store.onReady(() => {
                this.instanceReady(this.instanceRef.pipe(filter((instance) => !!instance)));
            });
        });
    }

    get instanceRef(): NgtRef<TInstance> {
        return this.read((s) => s.instanceRef);
    }

    get instanceValue(): TInstance {
        if (!this.instanceRef.value) return this.instanceRef.value;
        return this._isRaw ? (this.instanceRef.value?.valueOf() as TInstance) : this.instanceRef.value;
    }

    get __ngt__(): NgtInstanceLocalState {
        return getInstanceLocalState(
            this._isRaw ? this.instanceRef.value : this.instanceValue
        ) as NgtInstanceLocalState;
    }

    get parent(): NgtRef | undefined {
        return this.parentRef?.();
        // if (!this.getState((s) => s.skipWrapper)) return this.parentRef?.();
        // return this.parentHostRef?.() || this.parentRef?.();
    }

    override ngOnDestroy() {
        this.zone.runOutsideAngular(() => {
            this.destroy();
        });
        super.ngOnDestroy();
    }

    private destroy() {
        if (this.instanceValue) {
            if (is.object3d(this.instanceValue)) {
                const parentInstance = this.parent;
                if (parentInstance && is.object3d(parentInstance.value)) {
                    removeInteractivity(this.__ngt__.stateFactory.bind(this.__ngt__), this.instanceValue);
                    parentInstance.value.remove(this.instanceValue);
                    invalidateInstance(parentInstance.value);
                }

                if (this.instanceValue.clear != null) {
                    this.instanceValue.clear();
                }
            } else {
                if (this.__ngt__) {
                    // non-scene objects
                    const previousAttach = this.__ngt__.attach;
                    if (previousAttach != null) {
                        if (typeof previousAttach === 'function') {
                            previousAttach();
                        } else {
                            const previousAttachValue = this.__ngt__.attachValue;
                            if (this.__ngt__.parentRef && this.__ngt__.parentRef.value) {
                                mutate(this.__ngt__.parentRef.value, previousAttachValue, previousAttach);
                            }
                        }

                        if (this.__ngt__.parentRef && this.__ngt__.parentRef.value) {
                            invalidateInstance(this.__ngt__.parentRef.value);
                        }
                    }
                }
            }

            const dispose = (this.instanceValue as NgtAnyRecord)['dispose'];
            if (dispose && typeof dispose === 'function') {
                dispose.apply(this.instanceValue);
            }
        }

        this.write({ attach: [] });
        this.instanceRef.complete();
    }

    private eventNameToHandler(
        controllerEvent: EventEmitter<NgtThreeEvent<PointerEvent>> | EventEmitter<NgtThreeEvent<WheelEvent>>
    ) {
        return (event: Parameters<Exclude<NgtEventHandlers[typeof supportedEvents[number]], undefined>>[0]) => {
            // go back into Angular Zone so that state updates on these events trigger CD
            this.zone.run(() => {
                controllerEvent.emit(event as NgtThreeEvent<any>);
            });
        };
    }

    // protected get optionsFields(): string[] {
    //     return [];
    // }
    //
    // /**
    //  * Subclasses can customize this to run setOptions on custom trigger
    //  * @protected
    //  */
    // protected setOptionsTrigger$: Observable<{}> = of({});
    //
    // private readonly init = this.effect(tapEffect(() => this.initFn(this.prepareInstance.bind(this))));
    //
    // protected abstract initFn(prepareInstance: NgtPrepareInstanceFn<TInstance>): (() => void) | void | undefined;
    //
    // protected initTrigger$: Observable<any> = this.instanceArgs$;
    //
    // private readonly setOptions = this.effect<string[]>(
    //     tap((newOptionsKeys) => {
    //         // no options; return early
    //         if (newOptionsKeys.length === 0) return;
    //
    //         const instanceState = this.getState();
    //         const options = {} as NgtAnyRecord;
    //
    //         // handling rotation and quaternion
    //         if (newOptionsKeys.includes('rotation')) {
    //             options['rotation'] = instanceState['rotation'];
    //         } else if (newOptionsKeys.includes('quaternion')) {
    //             options['quaternion'] = instanceState['quaternion'];
    //         }
    //
    //         const isMaterial = is.material(this.instanceValue);
    //         for (const key of newOptionsKeys) {
    //             // skip rotation and quaternion because we already handled them
    //             if (['rotation', 'quaternion'].includes(key)) continue;
    //             const shouldUseOption = isMaterial ? instanceState[key] !== undefined : instanceState[key] !== null;
    //
    //             if (shouldUseOption) {
    //                 options[key] = instanceState[key];
    //             }
    //         }
    //
    //         if (isMaterial) {
    //             if ('uniforms' in this.instanceValue && newOptionsKeys.includes('uniforms')) {
    //                 options['uniforms'] = {
    //                     ...(this.instanceValue as unknown as THREE.ShaderMaterial)['uniforms'],
    //                     ...instanceState['uniforms'],
    //                 };
    //             }
    //         }
    //
    //         applyProps(this.instanceValue, options);
    //
    //         this.postSetOptions(this.instanceValue);
    //
    //         checkUpdate(this.instanceValue);
    //
    //         if (this.update.observed) {
    //             this.update.emit(this.instanceValue);
    //         }
    //     })
    // );
    //
    // private readonly attachToParent = this.effect(
    //     tap(() => {
    //         const attach = this.getState((s) => s.attach);
    //
    //         let parentInstanceRef = this.__ngt__.parentRef;
    //
    //         // if no parentInstance, try re-run the factory due to late init
    //         if (!parentInstanceRef || !parentInstanceRef.value) {
    //             // return early if failed to retrieve
    //             if (!this.parent?.value) return;
    //
    //             // reassign on instance internal state
    //             this.__ngt__.parentRef = this.parent;
    //             parentInstanceRef = this.parent;
    //         }
    //
    //         if (typeof attach === 'function') {
    //             const attachCleanUp = attach(parentInstanceRef, this.instanceRef);
    //             if (attachCleanUp) {
    //                 this.__ngt__.attach = attachCleanUp;
    //             }
    //         } else {
    //             const propertyToAttach = [...attach];
    //
    //             // if propertyToAttach is empty
    //             if (propertyToAttach.length === 0) return;
    //
    //             // array material handling
    //             if (
    //                 propertyToAttach[0] === 'material' &&
    //                 propertyToAttach[1] &&
    //                 typeof Number(propertyToAttach[1]) === 'number' &&
    //                 is.material(this.instanceValue)
    //             ) {
    //                 if (!Array.isArray((parentInstanceRef.value as unknown as THREE.Mesh).material)) {
    //                     (parentInstanceRef.value as unknown as THREE.Mesh).material = [];
    //                 }
    //             }
    //
    //             // retrieve the current value on the parentInstance, so we can reset it later
    //             this.__ngt__.attachValue = propertyToAttach.reduce(
    //                 (value, property) => value[property],
    //                 parentInstanceRef.value
    //             );
    //
    //             // attach the instance value on the parent
    //             mutate(parentInstanceRef.value, this.instanceValue, propertyToAttach);
    //
    //             // validate on the instance
    //             invalidateInstance(this.instanceValue);
    //
    //             // validate on the parent
    //             if (parentInstanceRef.value.__ngt__) {
    //                 invalidateInstance(parentInstanceRef.value);
    //             }
    //
    //             this.__ngt__.attach = propertyToAttach;
    //             this.set({ attach: propertyToAttach });
    //         }
    //
    //         checkUpdate(parentInstanceRef.value);
    //         checkUpdate(this.instanceValue);
    //     })
    // );
    //
    // private readonly instanceReady = this.effect(
    //     tapEffect(() => {
    //         this.postInit();
    //
    //         if (this.canInit) {
    //             // assigning options
    //
    //             const setOptionsSub = this.setOptions(
    //                 this.select(
    //                     optionsFieldsToKeys$(this, this.optionsFields, is.material(this.instanceValue)),
    //                     this.setOptionsTrigger$,
    //                     (optionsKeys) => optionsKeys
    //                 )
    //             );
    //
    //             // attaching
    //             if (!this.getState((s) => s.noAttach)) {
    //                 this.attachToParent(this.parent);
    //             }
    //
    //             // emitting
    //             if (!this.hasEmittedAlready) {
    //                 this.ready.emit(this.instanceValue);
    //                 this.hasEmittedAlready = true;
    //             }
    //
    //             return () => {
    //                 setOptionsSub.unsubscribe();
    //             };
    //         }
    //     })
    // );
    //
    // /**
    //  * Subclasses can use this function to run logic **before** NgtStore is ready
    //  * @protected
    //  */
    // protected preStoreReady() {
    //     return;
    // }
    //
    // /**
    //  * Subclasses can use this function to run logic **after** NgtStore is ready
    //  * @protected
    //  */
    // protected postStoreReady() {
    //     return;
    // }
    //
    // /**
    //  * Subclasses can use this function to run post-init logic
    //  * @protected
    //  */
    // protected postInit() {
    //     return;
    // }
    //
    // /**
    //  * Can be used by subclasses to run additional logic after options are set
    //  * @protected
    //  */
    // // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // protected postSetOptions(_: TInstance) {
    //     return;
    // }
    //
    // /**
    //  * Subclasses can use this function to calculate instance arguments
    //  * @param instanceArgs
    //  * @protected
    //  */
    // protected initInstanceArgs(instanceArgs: unknown[]) {
    //     return instanceArgs;
    // }
    //
    // override initialize() {
    //     super.initialize();
    //     this.set({
    //         instanceRef: new NgtRef(null),
    //         instanceArgs: [],
    //         attach: [],
    //         noAttach: false,
    //         skipWrapper: false,
    //         skipInit: false,
    //         noAttachExplicit: false,
    //         skipWrapperExplicit: false,
    //         skipInitExplicit: false,
    //         attachExplicit: false,
    //     });
    // }
    //
    // ngOnInit() {
    //     this.zone.runOutsideAngular(() => {
    //         // run logic before the store is ready; aka before the canvas entities are created and ready
    //         this.preStoreReady();
    //
    //         this.store.onReady(() => {
    //             this.postStoreReady();
    //
    //             // now run init, but only if this is NOT a wrapper and the skipInit flag is not set
    //             if (this.canInit) {
    //                 this.init(this.initTrigger$);
    //             }
    //
    //             // make sure `instance` is available before doing anything
    //             this.instanceReady(this.instanceRef.pipe(filter((instance) => instance !== null)));
    //         });
    //     });
    // }
    //
    // override ngOnDestroy() {
    //     this.zone.runOutsideAngular(() => {
    //         this.destroy();
    //     });
    //     super.ngOnDestroy();
    // }
    //
    // protected destroy() {
    //     if (this.instanceValue) {
    //         if (is.object3d(this.instanceValue)) {
    //             const parentInstance = this.parent;
    //             if (parentInstance && is.object3d(parentInstance.value)) {
    //                 removeInteractivity(this.__ngt__.stateGetter.bind(this.__ngt__), this.instanceValue);
    //             }
    //
    //             if (this.instanceValue.clear != null) {
    //                 this.instanceValue.clear();
    //             }
    //         } else {
    //             // non-scene objects
    //             const previousAttach = this.__ngt__.attach;
    //             if (previousAttach != null) {
    //                 if (typeof previousAttach === 'function') {
    //                     previousAttach();
    //                 } else {
    //                     const previousAttachValue = this.__ngt__.attachValue;
    //                     if (this.__ngt__.parentRef && this.__ngt__.parentRef.value) {
    //                         mutate(this.__ngt__.parentRef.value, previousAttachValue, previousAttach);
    //                     }
    //                 }
    //
    //                 if (this.__ngt__.parentRef && this.__ngt__.parentRef.value) {
    //                     checkUpdate(this.__ngt__.parentRef.value);
    //                 }
    //             }
    //         }
    //
    //         const dispose = (this.instanceValue as NgtAnyRecord)['dispose'];
    //         if (dispose && typeof dispose === 'function') {
    //             dispose.apply(this.instanceValue);
    //         }
    //     }
    //
    //     this.set({ attach: [] });
    //     this.instanceRef.complete();
    // }
    //
    // private prepareInstance(
    //     instance: TInstance,
    //     prepareOptions: {
    //         parentStateGetter?: NgtStateGetter;
    //         rootStateGetter?: NgtStateGetter;
    //         uuid?: string;
    //     } = {}
    // ): NgtInstanceNode<TInstance> {
    //     if (!prepareOptions.parentStateGetter) {
    //         prepareOptions.parentStateGetter = this.store.getState;
    //     }
    //
    //     if (!prepareOptions.rootStateGetter) {
    //         prepareOptions.rootStateGetter = this.store.rootStateGetter;
    //     }
    //
    //     if (prepareOptions.uuid && 'uuid' in instance) {
    //         (instance as NgtAnyRecord)['uuid'] = prepareOptions.uuid;
    //     }
    //
    //     const prepInstance = prepare(
    //         instance,
    //         prepareOptions.parentStateGetter!,
    //         prepareOptions.rootStateGetter!,
    //         this.parent,
    //         this.instanceRef,
    //         this.isPrimitive
    //     );
    //
    //     this.instanceRef.set(prepInstance);
    //
    //     requestAnimationFrame(() => {
    //         const { noAttach, skipWrapper } = this.getState();
    //         if (!noAttach && !skipWrapper) {
    //             const parentInstanceNode = getInstanceLocalState(getInstanceLocalState(prepInstance)?.parentRef?.value);
    //
    //             if (parentInstanceNode) {
    //                 if (prepInstance['isGroup']) {
    //                     // debugger;
    //                 }
    //                 const collections = is.object3d(prepInstance)
    //                     ? parentInstanceNode.objectsRefs
    //                     : parentInstanceNode.instancesRefs;
    //                 collections.set((s) => [...s, this.instanceRef]);
    //             }
    //         }
    //     });
    //
    //     return prepInstance;
    // }
    //
    // get instanceRef(): NgtRef<TInstance> {
    //     return this.getState((s) => s.instanceRef);
    // }
    //
    // get instanceValue(): TInstance {
    //     return this.isRaw ? (this.instanceRef.value?.valueOf() as TInstance) : this.instanceRef.value;
    // }
    //
    // get instanceArgs$() {
    //     return this.select((s) => s.instanceArgs);
    // }
    //
    // get instanceArgs(): unknown[] {
    //     return this.getState((s) => s.instanceArgs);
    // }
    //
    // set instanceArgs(v: unknown | unknown[]) {
    //     const args = Array.isArray(v) ? v : [v];
    //     this.set({ instanceArgs: args });
    //     if (this.instanceRef && this.__ngt__) {
    //         if (!this.__ngt__.memoized) {
    //             this.__ngt__.memoized = {};
    //         }
    //         this.__ngt__.memoized['args'] = args;
    //     }
    // }
    //
    // get __ngt__(): NgtInstanceLocalState {
    //     return getInstanceLocalState(this.isRaw ? this.instanceRef.value : this.instanceValue) as NgtInstanceLocalState;
    // }
    //
    // get parent(): NgtRef {
    //     if (!this.getState((s) => s.skipWrapper)) return this.parentRef?.();
    //     return this.parentHostRef?.() || this.parentRef?.();
    // }
    //
    // get canInit() {
    //     return !this.isWrapper && !this.getState((s) => s.skipInit);
    // }
}

export const NGT_INSTANCE_INPUTS = [
    'ref',
    'attach',
    'skipWrapper',
    'skipInit',
    'noAttach',
    'beforeRender',
    'priority',
    'updateCallback',
    'readyCallback',
];

export const NGT_INSTANCE_OUTPUTS = [...supportedEvents];
