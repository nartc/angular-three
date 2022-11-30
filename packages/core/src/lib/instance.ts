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
    Provider,
} from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { NgtRef } from './ref';
import { filterFalsy, NgtComponentStore, tapEffect } from './stores/component-store';
import { NgtStore } from './stores/store';
import type {
    NgtAnyCtor,
    NgtAnyFunction,
    NgtAnyRecord,
    NgtAttachFunction,
    NgtBeforeRenderCallback,
    NgtEventHandlers,
    NgtInstanceLocalState,
    NgtThreeEvent,
} from './types';
import { applyProps } from './utils/apply-props';
import { removeInteractivity } from './utils/events';
import { getInstanceLocalState } from './utils/get-instance-local-state';
import { invalidateInstance } from './utils/instance';
import { is } from './utils/is';
import { mutate } from './utils/mutate';

export const NGT_PROXY_INSTANCE = Symbol.for('__ngt__proxy__instance__');

export const NGT_INSTANCE_REF_FACTORY = new InjectionToken<NgtAnyFunction<NgtRef>>('NgtInstance[instanceRef] factory');
export const NGT_COMPOUND_INSTANCE_REF_FACTORY = new InjectionToken<NgtAnyFunction<NgtRef>>(
    'NgtCompound[instanceRef] factory'
);

export function provideInstanceRef<
    TInstanceType extends object = any,
    TCtor extends NgtAnyCtor<TInstanceType> = NgtAnyCtor<TInstanceType>
>(ctor: TCtor): Provider;
export function provideInstanceRef<
    TInstanceType extends object = any,
    TCtor extends NgtAnyCtor<TInstanceType> = NgtAnyCtor<TInstanceType>
>(ctor: TCtor, factory: (instance: InstanceType<TCtor>) => NgtRef): Provider;
export function provideInstanceRef<
    TInstanceType extends object = any,
    TCtor extends NgtAnyCtor<TInstanceType> = NgtAnyCtor<TInstanceType>
>(ctor: TCtor, options: { factory?: (instance: InstanceType<TCtor>) => NgtRef; compound?: true }): Provider;
export function provideInstanceRef<
    TInstanceType extends object = any,
    TCtor extends NgtAnyCtor<TInstanceType> = NgtAnyCtor<TInstanceType>
>(
    ctor: TCtor,
    optionsOrFactory?:
        | ((instance: InstanceType<TCtor>) => NgtRef)
        | { factory?: (instance: InstanceType<TCtor>) => NgtRef; compound?: true }
) {
    let factory: ((instance: InstanceType<TCtor>) => NgtRef) | undefined = undefined;
    let compound = false;

    if (optionsOrFactory) {
        if (typeof optionsOrFactory === 'object') {
            factory = optionsOrFactory.factory;
            compound = optionsOrFactory.compound ?? false;
        } else {
            factory = optionsOrFactory;
        }
    }

    if (compound) {
        return {
            provide: NGT_COMPOUND_INSTANCE_REF_FACTORY,
            useFactory: (instance: InstanceType<TCtor>) => {
                if (factory) {
                    return () => factory!(instance);
                }

                return () =>
                    (instance as NgtAnyRecord)['instanceRef'] || (instance as NgtAnyRecord)['instance']['instanceRef'];
            },
            deps: [ctor],
        };
    }

    return {
        provide: NGT_INSTANCE_REF_FACTORY,
        useFactory: (instance: InstanceType<TCtor>) => {
            if (factory) {
                return () => factory!(instance);
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

export function injectCompoundInstanceRef(): NgtAnyFunction<NgtRef>;
export function injectCompoundInstanceRef(options: InjectOptions & { optional?: false }): NgtAnyFunction<NgtRef>;
export function injectCompoundInstanceRef(options: InjectOptions & { optional?: true }): NgtAnyFunction<NgtRef> | null;
export function injectCompoundInstanceRef(options: InjectOptions = {}) {
    return inject(NGT_COMPOUND_INSTANCE_REF_FACTORY, options);
}

export interface NgtInstanceState<TInstance extends object = NgtAnyRecord> {
    instanceRef: NgtRef<TInstance>;
    instanceArgs: unknown[];
    attach: string[] | NgtAttachFunction;
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
        if (is.ref(instance) && instance.value === null) {
            instance.set(this.instanceValue);
            this.write({ instanceRef: instance });
        } else if (!is.ref(instance) && instance !== null) {
            this.instanceRef.set(instance as TInstance);
        }
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

    @Input() set priority(priority: number) {
        this.write({ priority });
    }

    @Input() set beforeRender(beforeRender: NgtBeforeRenderCallback<TInstance>) {
        this.write({ beforeRender });
    }

    @Input() set readyCallback(readyCallback: ((instance: TInstance) => void) | (() => void)) {
        this.write({ readyCallback });
    }

    @Input() set updateCallback(updateCallback: ((instance: TInstance) => void) | (() => void)) {
        this.write({ updateCallback });
    }

    @Input() set dispose(dispose: (() => void) | null) {
        this.write({ dispose });
    }

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
    private _isRaw = false;
    set isRaw(val: boolean) {
        this._isRaw = val;
    }

    private readonly parentInstanceRef = injectInstanceRef({ skipSelf: true, optional: true });
    private readonly compoundInstanceRef = injectCompoundInstanceRef({ skipSelf: true, optional: true });

    private compoundParentRef?: NgtAnyFunction<NgtRef>;

    private readonly instanceReady = this.effect(
        tapEffect(() => {
            this.handleEvents();

            let attachToParentSubscription: Subscription;
            if (this.parent) {
                attachToParentSubscription = this.attachToParent(this.parent.pipe(filterFalsy()));
                queueMicrotask(() => {
                    const parentInstanceNode = getInstanceLocalState(this.__ngt__?.parentRef?.value);
                    if (parentInstanceNode) {
                        const collections = is.object3d(this.instanceValue)
                            ? parentInstanceNode.objectsRefs
                            : parentInstanceNode.instancesRefs;
                        collections.set((s) => [...s, this.instanceRef]);
                    }
                });
            }

            if (is.object3d(this.instanceValue) && is.object3d(this.proxyInstance)) {
                this.setupBeforeRender(this.select((s) => s['beforeRender']).pipe(filterFalsy()));
            }

            this.callReadyCallback(this.select((s) => s['readyCallback']).pipe(filterFalsy()));

            return () => {
                attachToParentSubscription?.unsubscribe();
            };
        })
    );

    private setupBeforeRender = this.effect(
        tapEffect(() => {
            const beforeRender = this.read((s) => s['beforeRender']);
            const internal = this.store.read((s) => s.internal);
            return internal.subscribe(
                (state, object) => beforeRender!(state, object),
                this.read((s) => s['priority']),
                this.store.read,
                this.proxyInstance as THREE.Object3D
            );
        })
    );

    private callReadyCallback = this.effect(
        tap(() => {
            const readyCallback = this.read((s) => s['readyCallback']);
            readyCallback(this.instanceValue);
        })
    );

    private handleEvents = this.effect<void>(
        tapEffect(() => {
            if (this.instanceValue && is.object3d(this.instanceValue) && is.object3d(this.proxyInstance)) {
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
                    getInstanceLocalState(this.instanceValue)
                        ?.stateFactory()
                        .rootStateFactory()
                        .addInteraction(this.instanceValue);
                }
            }
            return () => {
                if (is.object3d(this.instanceValue) && this.__ngt__.eventCount > 0) {
                    getInstanceLocalState(this.instanceValue)
                        ?.stateFactory()
                        .rootStateFactory()
                        .removeInteraction(this.instanceValue.uuid);
                }
            };
        })
    );

    private readonly attachToParent = this.effect(
        tap(() => {
            const attach = this.read((s) => s.attach);

            let parent = this.parent;
            const parentInstanceRef = this.parentInstanceRef?.();

            if (parentInstanceRef && parent && is.object3d(parent.value) && is.object3d(parentInstanceRef.value)) {
                if (
                    (is.scene(parentInstanceRef.value) && parent.value.parent === parentInstanceRef.value) ||
                    parentInstanceRef.value.parent === parent.value ||
                    parentInstanceRef.value.parent?.parent === parent.value
                ) {
                    parent = this.__ngt__.parentRef = parentInstanceRef;
                }
            }

            if (!parent) {
                // re-run factory
                if (!this.parent?.value) return;
                parent = this.parent;
            }

            // reassign on instance internal state
            if (this.__ngt__) {
                this.__ngt__.parentRef = this.parent as NgtRef;
            }

            if (typeof attach === 'function') {
                const attachCleanUp = attach(parent, this.instanceRef, this.store.read);
                if (attachCleanUp) {
                    this.__ngt__.attach = attachCleanUp;
                }
            } else {
                const propertyToAttach = [...attach];

                // if propertyToAttach is empty
                if (propertyToAttach.length === 0) {
                    // this might be the case where we are attaching an object3D to the parent object3D
                    if (
                        is.object3d(this.instanceValue) &&
                        is.object3d(this.proxyInstance) &&
                        is.object3d(parent?.value)
                    ) {
                        parent?.value.add(this.proxyInstance);
                    }
                } else {
                    // array material handling
                    if (
                        propertyToAttach[0] === 'material' &&
                        propertyToAttach[1] &&
                        typeof Number(propertyToAttach[1]) === 'number' &&
                        is.material(this.instanceValue)
                    ) {
                        if (!Array.isArray(parent.value.material)) {
                            parent.value.material = [];
                        }
                    }

                    // retrieve the current value on the parentInstance, so we can reset it later
                    if (this.__ngt__) {
                        this.__ngt__.attachValue = propertyToAttach.reduce(
                            (value, property) => value[property],
                            parent.value
                        );
                    }

                    // attach the instance value on the parent
                    mutate(parent.value, this._isRaw ? this.instanceValue : this.proxyInstance, propertyToAttach);
                }

                // validate on the instance
                invalidateInstance(this.instanceValue);

                // validate on the parent
                if (getInstanceLocalState(parent.value)) {
                    invalidateInstance(parent.value);
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
            wrappedRef: new NgtRef(null),
            attach: [],
            priority: 0,
            dispose: null,
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.store.onReady(() => {
                this.instanceReady(this.instanceRef.pipe(filterFalsy()));
            });
        });
    }

    setCompoundParentRef(compoundParentRef: NgtAnyFunction<NgtRef>) {
        this.compoundParentRef = compoundParentRef;
    }

    get instanceRef(): NgtRef<TInstance> {
        return this.read((s) => s.instanceRef);
    }

    get instanceValue(): TInstance {
        if (!this.instanceRef.value) return this.instanceRef.value;
        return this._isRaw ? (this.instanceRef.value?.valueOf() as TInstance) : this.instanceRef.value;
    }

    get proxyInstance(): TInstance {
        return (this.instanceValue as any)?.[NGT_PROXY_INSTANCE];
    }

    get __ngt__(): NgtInstanceLocalState {
        return getInstanceLocalState(
            this._isRaw ? this.instanceRef.value : this.instanceValue
        ) as NgtInstanceLocalState;
    }

    get parent(): NgtRef | undefined {
        const compoundInstanceRef = this.compoundInstanceRef?.();
        const compoundParentRef = this.compoundParentRef?.();
        let parentInstanceRef = this.parentInstanceRef?.();

        if (compoundInstanceRef && compoundInstanceRef.value !== this.instanceValue) {
            return compoundInstanceRef;
        }

        if (compoundParentRef && compoundParentRef.value !== this.instanceValue) {
            return compoundParentRef;
        }

        if (parentInstanceRef && this.__ngt__ && parentInstanceRef !== this.__ngt__.parentRef) {
            if (this.__ngt__.parentRef !== null) {
                parentInstanceRef = this.__ngt__.parentRef as NgtRef;
            } else {
                this.__ngt__.parentRef = parentInstanceRef;
            }
        }

        return parentInstanceRef;
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

            if (this.read((s) => s['dispose'])) {
                this.read((s) => s['dispose'])();
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
}
