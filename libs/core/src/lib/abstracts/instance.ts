import {
    Directive,
    EventEmitter,
    Inject,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Optional,
    Output,
    SkipSelf,
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
import { Ref } from '../ref';
import {
    NgtComponentStore,
    startWithUndefined,
    tapEffect,
} from '../stores/component-store';
import { NgtStore } from '../stores/store';
import { NGT_INSTANCE_HOST_REF, NGT_INSTANCE_REF } from '../tokens';
import type {
    AnyFunction,
    AttachFunction,
    BooleanInput,
    NgtInstanceInternal,
    NgtUnknownInstance,
    UnknownRecord,
} from '../types';
import { applyProps } from '../utils/apply-props';
import { checkNeedsUpdate } from '../utils/check-needs-update';
import { coerceBooleanProperty } from '../utils/coercion';
import { removeInteractivity } from '../utils/events';
import { prepare } from '../utils/instance';
import { is } from '../utils/is';
import { mutate } from '../utils/mutate';

export interface NgtInstanceState<TInstance extends object = UnknownRecord> {
    instance: Ref<TInstance>;
    instanceArgs: unknown[];
    attach: string[] | AttachFunction;
    attachExplicit?: boolean;
    noAttach: boolean;
    noAttachExplicit?: boolean;
    skipParent: boolean;
    skipParentExplicit?: boolean;
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
    @Input() set ref(ref: Ref) {
        this.set({ instance: ref } as Partial<TInstanceState>);
    }

    @Input() set skipParent(skipParent: BooleanInput) {
        this.set({
            attachExplicit: true,
            skipParent: coerceBooleanProperty(skipParent),
        } as Partial<TInstanceState>);
    }
    get skipParent() {
        return this.get((s) => s.skipParent);
    }

    @Output() ready = new EventEmitter<TInstance>();
    protected hasEmittedAlready = false;

    @Input() set noAttach(noAttach: BooleanInput) {
        this.set({
            noAttachExplicit: true,
            noAttach: coerceBooleanProperty(noAttach),
        } as Partial<TInstanceState>);
    }
    get noAttach() {
        return this.get((s) => s.noAttach);
    }

    @Input()
    set attach(value: string | string[] | AttachFunction | undefined) {
        if (value) {
            this.set({
                skipParentExplicit: true,
                attach:
                    typeof value === 'function'
                        ? value
                        : is.arr(value)
                        ? value
                        : [value],
            } as Partial<TInstanceState>);
        }
    }
    get attach() {
        return this.get((s) => s.attach);
    }

    readonly instance$ = this.select((s) => s.instance).pipe(
        switchMap((instance) =>
            instance.pipe(
                filter((instance): instance is TInstance => instance != null)
            )
        )
    );

    get instance(): Ref<TInstance> {
        return this.get((s) => s.instance);
    }

    get instanceValue(): TInstance {
        return this.isRaw
            ? (this.instance.value.valueOf() as TInstance)
            : this.instance.value;
    }

    get __ngt__(): NgtInstanceInternal {
        return (this.instance.value as NgtUnknownInstance).__ngt__;
    }

    get parent(): Ref {
        if (!this.skipParent) return this.parentRef?.();
        return this.parentHostRef?.() || this.parentRef?.();
    }

    protected readonly instanceArgs$ = this.select((s) => s.instanceArgs);

    set instanceArgs(v: unknown | unknown[]) {
        this.set({
            instanceArgs: is.arr(v) ? v : [v],
        } as Partial<TInstanceState>);
    }
    get instanceArgs() {
        return this.get((s) => s.instanceArgs);
    }

    constructor(
        protected zone: NgZone,
        protected store: NgtStore,
        @Optional()
        @SkipSelf()
        @Inject(NGT_INSTANCE_REF)
        protected parentRef: AnyFunction<Ref>,
        @Optional()
        @SkipSelf()
        @Inject(NGT_INSTANCE_HOST_REF)
        protected parentHostRef: AnyFunction<Ref>
    ) {
        super();
        this.set({
            instance: new Ref(null),
            instanceArgs: [],
            attach: [],
            noAttach: false,
            skipParent: false,
        } as unknown as TInstanceState);
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.preInit();
            this.onCanvasReady(this.store.ready$, () => {
                // make sure `instance()` is available before doing anything
                this.instanceReady(this.instance$);
            });
        });
    }

    /**
     * Sub-classes can use this function to run pre-init logic
     * @protected
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected preInit() {}

    /**
     * Sub-classes can choose to run additional logic after init
     * @protected
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected postInit() {}

    protected emitReady() {
        // only emit ready once to prevent reconstruct
        if (!this.hasEmittedAlready) {
            this.ready.emit(this.instanceValue);
            this.hasEmittedAlready = true;
        }
    }

    protected isPrimitive = false;
    protected isWrapper = false;
    protected isRaw = false;

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
            this.parent,
            this.instance,
            this.isPrimitive
        );

        this.postPrepare(prepInstance);
        this.instance.set(prepInstance);
        this.emitReady();

        if (!is.object3d(prepInstance) && !this.noAttach && !this.skipParent) {
            const parentObjects =
                prepInstance.__ngt__.parent?.value?.__ngt__.objects;
            parentObjects &&
                parentObjects.set([...parentObjects.value, this.instance]);
        }

        return prepInstance;
    }

    /**
     * Sub-classes can use this to modify the constructor parameters
     * before calling this.prepareInstance
     */
    protected adjustCtorParams(instanceArgs: unknown[]) {
        return instanceArgs;
    }

    /**
     * Sub-classes, if adjust CtorParams, can also use ctorParams$ to ensure ctor is re-invoked
     */
    protected get ctorParams$() {
        return this.instanceArgs$.pipe(map(() => ({})));
    }

    protected destroy() {
        if (this.instanceValue) {
            if (is.object3d(this.instanceValue)) {
                const parentInstance = this.parent;
                if (parentInstance && is.object3d(parentInstance.value)) {
                    removeInteractivity(
                        this.__ngt__.root.bind(this.__ngt__),
                        this.instanceValue
                    );
                }

                if (this.instanceValue.clear != null) {
                    this.instanceValue.clear();
                }
            } else {
                // non-scene objects
                const previousAttach = this.__ngt__.previousAttach;
                if (previousAttach != null) {
                    if (typeof previousAttach === 'function') {
                        previousAttach();
                        if (this.__ngt__.parent && this.__ngt__.parent.value) {
                            checkNeedsUpdate(this.__ngt__.parent.value);
                        }
                    } else {
                        const previousAttachValue =
                            this.__ngt__.previousAttachValue;
                        if (this.__ngt__.parent && this.__ngt__.parent.value) {
                            mutate(
                                this.__ngt__.parent.value,
                                previousAttach,
                                previousAttachValue
                            );
                            checkNeedsUpdate(this.__ngt__.parent.value);
                        }
                    }
                }
            }

            const dispose = (this.instanceValue as UnknownRecord)['dispose'];
            if (dispose && typeof dispose === 'function') {
                dispose.apply(this.instanceValue);
            }
        }

        this.set({ attach: [] } as unknown as Partial<TInstanceState>);
        this.instance.complete();
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
            const setOptionsSub = this.setOptions(
                this.select(
                    this.options$,
                    this.setOptionsTrigger$,
                    (options) => options
                )
            );

            // attaching
            if (!this.get((s) => s.noAttach)) {
                this.attachToParent();
            }

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

    /**
     * Sub-classes can customize this to run setOptions on custom trigger
     * @protected
     */
    protected get setOptionsTrigger$(): Observable<{}> {
        return of({});
    }

    private readonly setOptions = this.effect<UnknownRecord>(
        tap((options) => {
            // no options; return early
            if (Object.keys(options).length === 0) return;

            if (this.instanceValue) {
                // TODO: Material is handling this on their own. To be changed when [parameters] is removed
                if (is.material(this.instanceValue)) return;

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

                applyProps(this.instanceValue, customOptions);

                this.postSetOptions(this.instanceValue);

                this.checkUpdate(this.instanceValue);
            }
        })
    );

    private attachToParent = this.effect<void>(
        pipe(
            withLatestFrom(this.select((s) => s.attach)),
            tap(([, attach]) => {
                let parentInstanceRef = this.__ngt__.parent;

                // if no parentInstance, try re-run the factory due to late init
                if (!parentInstanceRef || !parentInstanceRef.value) {
                    // return early if failed to retrieve
                    if (!this.parent?.value) return;

                    // reassign on instance internal state
                    this.__ngt__.parent = this.parent;
                    parentInstanceRef = this.parent;
                }

                if (typeof attach === 'function') {
                    const attachCleanUp = attach(
                        parentInstanceRef,
                        this.instance
                    );
                    if (attachCleanUp) {
                        this.__ngt__.previousAttach = attachCleanUp;
                    }
                } else {
                    const propertyToAttach = [...attach];

                    // if propertyToAttach is empty
                    if (propertyToAttach.length === 0) return;

                    // array material handling
                    if (
                        propertyToAttach[0] === 'material' &&
                        propertyToAttach[1] &&
                        is.num(Number(propertyToAttach[1])) &&
                        is.material(this.instanceValue)
                    ) {
                        if (
                            !is.arr(
                                (
                                    parentInstanceRef.value as unknown as THREE.Mesh
                                ).material
                            )
                        ) {
                            (
                                parentInstanceRef.value as unknown as THREE.Mesh
                            ).material = [];
                        }
                    }

                    // retrieve the current value on the parentInstance so we can reset it later
                    this.__ngt__.previousAttachValue = propertyToAttach.reduce(
                        (value: any, property) => value[property],
                        parentInstanceRef.value
                    );

                    // attach the instance value on the parent
                    mutate(
                        parentInstanceRef.value,
                        propertyToAttach,
                        this.instanceValue
                    );

                    // validate on the instance
                    if (this.__ngt__) {
                        this.__ngt__.root().invalidate();
                    }

                    // also validate on the parentInstance
                    if (parentInstanceRef.value.__ngt__) {
                        parentInstanceRef.value.__ngt__.root().invalidate();
                    }

                    this.__ngt__.previousAttach = propertyToAttach;
                    this.set({
                        attach: propertyToAttach,
                    } as Partial<TInstanceState>);
                }
                this.checkUpdate(parentInstanceRef.value);
                this.checkUpdate(this.instanceValue);
            })
        )
    );

    private checkUpdate(value: unknown): void {
        if (is.object3d(value)) {
            value.updateMatrix();
        } else if (is.camera(value)) {
            if (is.perspective(value) || is.orthographic(value)) {
                value.updateProjectionMatrix();
            }
            value.updateMatrixWorld();
        }

        checkNeedsUpdate(value);
    }
}
