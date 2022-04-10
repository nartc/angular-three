import {
    Directive,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { filter, Observable, of, pipe, tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';
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
import { isGeometry } from '../utils/is-geometry';
import { isMaterial } from '../utils/is-material';
import { isOrthographicCamera } from '../utils/is-orthographic';
import { isPerspectiveCamera } from '../utils/is-perspective';
import { mutate } from '../utils/mutate';

export interface NgtInstanceState<TInstance extends object = UnknownRecord> {
    instance: NgtUnknownInstance<TInstance>;
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
        filter(
            (instance): instance is NgtUnknownInstance<TInstance> =>
                instance != null
        )
    );

    get instance(): TInstance {
        return this.get((s) => s.instance) as TInstance;
    }

    protected readonly instanceArgs$ = this.select((s) => s.instanceArgs);
    protected set instanceArgs(v: unknown | unknown[]) {
        this.set({
            instanceArgs: Array.isArray(v) ? v : [v],
        } as Partial<TInstanceState>);
    }

    get __ngt__(): NgtInstanceInternal {
        return (this.instance as NgtUnknownInstance)['__ngt__'];
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
            instance: undefined,
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
            this.ready.emit(this.instance);
            this.hasEmittedAlready = true;
        }
    }

    protected prepareInstance(
        instance: TInstance,
        keyToSet?: keyof TInstanceState
    ): TInstance {
        const prepInstance = prepare(
            instance,
            () => this.store.get(),
            this.parentInstanceFactory?.() as NgtUnknownInstance,
            this.instance as NgtUnknownInstance
        );
        this.postPrepare(prepInstance);

        if (keyToSet) {
            this.set({
                instance: prepInstance,
                [keyToSet]: prepInstance,
            } as Partial<TInstanceState>);
        }

        this.emitReady();
        return prepInstance;
    }

    protected destroy() {
        if ((this.instance as UnknownRecord)['isObject3D']) {
            const parentInstance = this.parentInstanceFactory?.();
            if (parentInstance && parentInstance['isObject3D']) {
                removeInteractivity(
                    this.__ngt__.root.bind(this.__ngt__),
                    this.instance as THREE.Object3D
                );
            }

            if ((this.instance as THREE.Object3D).clear) {
                (this.instance as THREE.Object3D).clear();
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

        const dispose = (this.instance as UnknownRecord)['dispose'];
        if (dispose && typeof dispose === 'function') {
            dispose();
        }

        this.set({
            instance: undefined,
            attach: [],
        } as unknown as Partial<TInstanceState>);
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

                if (this.instance) {
                    // TODO: Material is handling this on their own. To be changed when [parameters] is removed
                    if (isMaterial(this.instance)) return;

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
                        this.instance as NgtUnknownInstance,
                        customOptions
                    );

                    if (this.instance instanceof THREE.Object3D) {
                        this.instance.updateMatrix();
                    } else if (this.instance instanceof THREE.Camera) {
                        if (
                            isPerspectiveCamera(this.instance) ||
                            isOrthographicCamera(this.instance)
                        ) {
                            this.instance.updateProjectionMatrix();
                        }
                        this.instance.updateMatrixWorld();
                    }

                    this.postSetOptions(this.instance);
                    checkNeedsUpdate(this.instance);
                }
            });
        })
    );

    private attachToParent = this.effect<void>(
        pipe(
            withLatestFrom(this.select((s) => s.attach)),
            tap(([, attach]) => {
                // return early if no parent
                const parentInstance = this.__ngt__.parent;
                if (!parentInstance) return;

                if (typeof attach === 'function') {
                    const attachCleanUp = attach(parentInstance, this.instance);
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
                        if (isMaterial(this.instance)) {
                            propertyToAttach.push('material');
                        } else if (isGeometry(this.instance)) {
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
                    mutate(parentInstance, propertyToAttach, this.instance);

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
                checkNeedsUpdate(this.instance);
            })
        )
    );
}
