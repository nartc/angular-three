import {
    Directive,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import {
    filter,
    map,
    Observable,
    of,
    pairwise,
    pipe,
    startWith,
    switchMap,
    tap,
    withLatestFrom,
} from 'rxjs';
import * as THREE from 'three';
import { Ref } from '../ref';
import {
    NgtComponentStore,
    startWithUndefined,
    tapEffect,
} from '../stores/component-store';
import { NgtStore } from '../stores/store';
import type {
    AnyFunction,
    AttachFunction,
    NgtInstanceInternal,
    NgtUnknownInstance,
    UnknownRecord,
} from '../types';
import { applyProps } from '../utils/apply-props';
import { checkNeedsUpdate } from '../utils/check-needs-update';
import { removeInteractivity } from '../utils/events';
import { prepare } from '../utils/instance';
import { is } from '../utils/is';
import { mutate } from '../utils/mutate';

export interface NgtInstanceState<TInstance extends object = UnknownRecord> {
    instance: Ref<NgtUnknownInstance<TInstance>>;
    instanceArgs: unknown[];
    attach: string[] | AttachFunction;
    [option: string]: any;
}

@Directive()
export abstract class NgtInstance<
        TInstance extends object,
        TInstanceState extends NgtInstanceState<TInstance> = NgtInstanceState<TInstance>
    >
    extends NgtComponentStore<TInstanceState>
    implements OnInit, OnDestroy
{
    @Input() set ref(ref: Ref<any>) {
        this.set({ instance: ref } as Partial<TInstanceState>);
    }

    @Output() ready = new EventEmitter<TInstance>();
    protected hasEmittedAlready = false;

    @Input()
    set attach(value: string | string[] | AttachFunction | undefined) {
        if (value) {
            this.set({
                attach:
                    typeof value === 'function'
                        ? value
                        : Array.isArray(value)
                        ? value
                        : [value],
            } as Partial<TInstanceState>);
        }
    }

    readonly instance$ = this.select((s) => s.instance).pipe(
        switchMap((ref) =>
            ref.ref$.pipe(
                filter(
                    (instance): instance is NgtUnknownInstance<TInstance> =>
                        instance != null
                )
            )
        )
    );

    get instance(): Ref<NgtUnknownInstance<TInstance>> {
        return this.get((s) => s.instance);
    }

    protected readonly instanceArgs$ = this.select((s) => s.instanceArgs);
    protected set instanceArgs(v: unknown | unknown[]) {
        this.set({
            instanceArgs: Array.isArray(v) ? v : [v],
        } as Partial<TInstanceState>);
    }

    get __ngt__(): NgtInstanceInternal {
        return (this.instance.value as NgtUnknownInstance)['__ngt__'];
    }

    protected zone: NgZone;
    protected store: NgtStore;
    protected parentInstanceFactory?: AnyFunction<UnknownRecord>;

    constructor({
        zone,
        store,
        parentInstanceFactory,
    }: {
        zone: NgZone;
        store: NgtStore;
        parentInstanceFactory?: AnyFunction<UnknownRecord>;
    }) {
        super();
        this.zone = zone;
        this.store = store;
        this.parentInstanceFactory = parentInstanceFactory;

        this.set({
            instance: new Ref(null),
            instanceArgs: [],
            attach: [],
        } as unknown as TInstanceState);
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                // make sure `instance()` is available before doing anything
                this.instanceReady(this.instance$);
            });
        });
    }

    protected emitReady() {
        // only emit ready once to prevent reconstruct
        if (!this.hasEmittedAlready) {
            this.ready.emit(this.instance.value);
            this.hasEmittedAlready = true;
        }
    }

    prepareInstance(
        instance: TInstance,
        uuid?: string
    ): NgtUnknownInstance<TInstance> {
        if (uuid && 'uuid' in instance) {
            (instance as UnknownRecord)['uuid'] = uuid;
        }

        const prepInstance = prepare(
            instance,
            () => this.store.get(),
            this.parentInstanceFactory?.() as NgtUnknownInstance,
            this.instance?.value as NgtUnknownInstance
        );

        this.postPrepare(prepInstance);

        this.get((s) => s.instance).set(prepInstance);
        this.emitReady();

        if (!(prepInstance instanceof THREE.Object3D)) {
            prepInstance.__ngt__.parent?.__ngt__.objects.push(prepInstance);
        }

        return prepInstance;
    }

    protected destroy() {
        if ((this.instance.value as UnknownRecord)['isObject3D']) {
            const parentInstance = this.parentInstanceFactory?.();
            if (parentInstance && parentInstance['isObject3D']) {
                removeInteractivity(
                    this.__ngt__.root.bind(this.__ngt__),
                    this.instance.value as unknown as THREE.Object3D
                );
            }

            if ((this.instance.value as unknown as THREE.Object3D).clear) {
                (this.instance.value as unknown as THREE.Object3D).clear();
            }
        } else {
            // non-scene objects
            const previousAttach = this.__ngt__.previousAttach;
            if (previousAttach != null) {
                if (typeof previousAttach === 'function') {
                    previousAttach();
                    if (this.__ngt__.parent) {
                        checkNeedsUpdate(this.__ngt__.parent);
                    }
                } else {
                    const previousAttachValue =
                        this.__ngt__.previousAttachValue;
                    if (this.__ngt__.parent) {
                        mutate(
                            this.__ngt__.parent,
                            previousAttach,
                            previousAttachValue
                        );
                        checkNeedsUpdate(this.__ngt__.parent);
                    }
                }
            }
        }

        const dispose = (this.instance.value as UnknownRecord)['dispose'];
        if (dispose && typeof dispose === 'function') {
            dispose();
        }

        this.set({ attach: [] } as unknown as Partial<TInstanceState>);
        this.get((s) => s.instance).complete();
    }

    /**
     * Can be used by sub-classes to run additional logic after prepare
     * @protected
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected postPrepare(_: TInstance): void {}

    protected get optionFields(): Record<string, boolean> {
        return {};
    }

    private get options$(): Observable<UnknownRecord> {
        const optionEntries = Object.entries(this.optionFields);
        if (optionEntries.length === 0) return of({});
        return this.select(
            ...optionEntries.map(([inputKey, shouldStartWithUndefined]) => {
                const subInput$ = this.select(
                    (s) => (s as UnknownRecord)[inputKey]
                );
                if (shouldStartWithUndefined)
                    return subInput$.pipe(startWithUndefined());
                return subInput$;
            }),
            (...args: any[]) =>
                args.reduce((record, arg, index) => {
                    record[optionEntries[index][0]] = arg;
                    return record;
                }, {} as UnknownRecord)
        ).pipe(
            startWith({}),
            pairwise(),
            map(([prev, curr]) => {
                return Object.entries(curr).reduce(
                    (options, [currKey, currValue]) => {
                        if (!is.equ(prev[currKey], currValue)) {
                            options[currKey] = currValue;
                        }
                        return options;
                    },
                    {} as UnknownRecord
                );
            })
        );
    }

    override ngOnDestroy() {
        this.zone.runOutsideAngular(() => {
            this.destroy();
        });
        super.ngOnDestroy();
    }

    private readonly instanceReady = this.effect<TInstance>(
        tapEffect(() => {
            // assigning
            const setOptionsSub = this.setOptions(this.options$);

            // attaching
            this.attachToParent();

            return () => {
                setOptionsSub.unsubscribe();
            };
        })
    );

    /**
     * Can be used by sub-classes to run additional logic after options are set
     * @protected
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected postSetOptions(_: TInstance): void {}

    private readonly setOptions = this.effect<UnknownRecord>(
        tap((options) => {
            this.zone.runOutsideAngular(() => {
                // no options; return early
                if (Object.keys(options).length === 0) return;

                if (this.instance.value) {
                    // TODO: Material is handling this on their own. To be changed when [parameters] is removed
                    if (is.material(this.instance.value)) return;

                    const state = this.get();
                    const customOptions = {} as UnknownRecord;

                    const { rotation, quaternion, ...restOptions } = options;

                    if (rotation) {
                        customOptions['rotation'] = state['rotation'];
                    } else if (quaternion) {
                        customOptions['quaternion'] = state['quaternion'];
                    }

                    for (const option of Object.keys(restOptions)) {
                        if (state[option] != null) {
                            customOptions[option] = state[option];
                        }
                    }

                    applyProps(
                        this.instance.value as NgtUnknownInstance,
                        customOptions
                    );

                    if (this.instance.value instanceof THREE.Object3D) {
                        this.instance.value.updateMatrix();
                    } else if (this.instance.value instanceof THREE.Camera) {
                        if (
                            is.perspective(this.instance.value) ||
                            is.orthographic(this.instance.value)
                        ) {
                            this.instance.value.updateProjectionMatrix();
                        }
                        this.instance.value.updateMatrixWorld();
                    }

                    this.postSetOptions(this.instance.value);
                    checkNeedsUpdate(this.instance.value);
                }
            });
        })
    );

    private attachToParent = this.effect<void>(
        pipe(
            withLatestFrom(this.select((s) => s.attach)),
            tap(([, attach]) => {
                let parentInstance = this.__ngt__.parent;

                // if no parentInstance, try re-run the factory due to late init
                if (!parentInstance) {
                    const parentInstanceFromFactory =
                        this.parentInstanceFactory?.();
                    // return early if failed to retrieve
                    if (!parentInstanceFromFactory) return;

                    // reassign on instance internal state
                    this.__ngt__.parent =
                        parentInstanceFromFactory as NgtUnknownInstance;
                    parentInstance =
                        parentInstanceFromFactory as NgtUnknownInstance;
                }

                if (typeof attach === 'function') {
                    const attachCleanUp = attach(
                        parentInstance,
                        this.instance.value
                    );
                    if (attachCleanUp) {
                        applyProps(
                            this.__ngt__ as unknown as NgtUnknownInstance,
                            {
                                previousAttach: attachCleanUp,
                            }
                        );
                    }
                } else {
                    const propertyToAttach = [...attach];
                    if (propertyToAttach.length === 0) {
                        if (is.material(this.instance.value)) {
                            propertyToAttach.push('material');
                        } else if (is.geometry(this.instance.value)) {
                            propertyToAttach.push('geometry');
                        }
                    }

                    // if propertyToAttach is still empty after material/geometry check
                    // the consumers are not using Geometry/Material and not providing [attach]
                    if (propertyToAttach.length === 0) return;

                    // retrieve the current value on the parentInstance so we can reset it later
                    this.__ngt__.previousAttachValue = propertyToAttach.reduce(
                        (value: any, property) => value[property],
                        parentInstance
                    );

                    // attach the instance value on the parent
                    mutate(
                        parentInstance as UnknownRecord,
                        propertyToAttach,
                        this.instance.value
                    );

                    // validate on the instance
                    if (this.__ngt__) {
                        this.__ngt__.root().invalidate();
                    }

                    // also validate on the parentInstance
                    if (parentInstance['__ngt__']) {
                        (parentInstance as NgtUnknownInstance).__ngt__
                            .root()
                            .invalidate();
                    }

                    this.__ngt__.previousAttach = propertyToAttach;
                    this.set({
                        attach: propertyToAttach,
                    } as Partial<TInstanceState>);
                }
                checkNeedsUpdate(parentInstance);
                checkNeedsUpdate(this.instance.value);
            })
        )
    );
}
