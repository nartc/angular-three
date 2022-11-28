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
    private readonly compoundParentRef = injectCompoundInstanceRef({ skipSelf: true, optional: true });
    private _isRaw = false;

    set isRaw(val: boolean) {
        this._isRaw = val;
    }

    private readonly instanceReady = this.effect(
        tapEffect(() => {
            this.handleEvents();

            let attachToParentSubscription: Subscription;
            if (this.parent) {
                attachToParentSubscription = this.attachToParent(this.parent.pipe(filter((parent) => !!parent)));
                const { noAttach, skipWrapper } = this.read();
                if (!noAttach && !skipWrapper) {
                    const parentInstanceNode = getInstanceLocalState(
                        getInstanceLocalState(this.instanceValue)?.parentRef?.value
                    );

                    if (parentInstanceNode) {
                        const collections = is.object3d(this.instanceValue)
                            ? parentInstanceNode.objectsRefs
                            : parentInstanceNode.instancesRefs;
                        collections.set((s) => [...s, this.instanceRef]);
                    }
                }
            }

            let beforeRenderCleanUp: () => void;
            if (this.beforeRender && is.object3d(this.instanceValue) && is.object3d(this.proxyInstance)) {
                beforeRenderCleanUp = this.store
                    .read((s) => s.internal)
                    .subscribe(
                        (state, object) => this.beforeRender!(state, object),
                        this.priority,
                        this.store.read,
                        this.proxyInstance
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
                    if (
                        is.object3d(this.instanceValue) &&
                        is.object3d(this.proxyInstance) &&
                        is.object3d(this.parent?.value)
                    ) {
                        this.parent?.value.add(this.proxyInstance);
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
                    mutate(parentInstanceRef.value, this.proxyInstance, propertyToAttach);
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
            wrappedRef: new NgtRef(null),
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

    get proxyInstance(): TInstance {
        return (this.instanceValue as any)?.[NGT_PROXY_INSTANCE];
    }

    get __ngt__(): NgtInstanceLocalState {
        return getInstanceLocalState(
            this._isRaw ? this.instanceRef.value : this.instanceValue
        ) as NgtInstanceLocalState;
    }

    get parent(): NgtRef | undefined {
        const compoundParentRef = this.compoundParentRef?.();
        let parentRef = this.parentRef?.();

        if (compoundParentRef && compoundParentRef.value !== this.instanceValue) {
            return compoundParentRef;
        }

        if (parentRef && parentRef !== this.__ngt__.parentRef) {
            parentRef = this.__ngt__.parentRef as NgtRef;
        }

        return parentRef;
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
}
