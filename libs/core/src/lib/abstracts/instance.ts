import { checkNeedsUpdate } from '@angular-three/core';
import {
    Directive,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { filter, pipe, tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';
import { NgtComponentStore } from '../stores/component-store';
import type {
    AnyFunction,
    AttachFunction,
    BooleanInput,
    NgtInstanceInternal,
    NgtUnknownInstance,
    UnknownRecord,
} from '../types';
import { coerceBooleanProperty } from '../utils/coercion';
import { removeInteractivity } from '../utils/events';
import { isGeometry } from '../utils/is-geometry';
import { isMaterial } from '../utils/is-material';
import { mutate } from '../utils/mutate';

export interface NgtInstanceState<TInstance extends object = UnknownRecord> {
    instance: NgtUnknownInstance<TInstance>;
    attach: string[] | AttachFunction;
    assign: UnknownRecord;
}

@Directive()
export abstract class NgtInstance<
        TInstance extends object = UnknownRecord,
        TInstanceState extends NgtInstanceState<TInstance> = NgtInstanceState<TInstance>
    >
    extends NgtComponentStore<TInstanceState>
    implements OnInit, OnDestroy
{
    @Output() ready = new EventEmitter<TInstance>();
    protected hasEmittedReady = false;

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

    @Input()
    set assign(value: UnknownRecord) {
        this.set({ assign: value } as Partial<TInstanceState>);
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

    get __ngt__(): NgtInstanceInternal {
        return (this.instance as NgtUnknownInstance)['__ngt__'];
    }

    private _shouldAttach = false;
    get shouldAttach(): boolean {
        return this._shouldAttach;
    }
    @Input()
    set shouldAttach(value: BooleanInput) {
        this._shouldAttach = coerceBooleanProperty(value);
    }

    protected zone: NgZone;
    protected parentInstanceFactory?: AnyFunction<UnknownRecord>;

    constructor({
        zone,
        shouldAttach = false,
        parentInstanceFactory,
    }: {
        zone: NgZone;
        shouldAttach?: boolean;
        parentInstanceFactory?: AnyFunction<UnknownRecord>;
    }) {
        super();
        this.zone = zone;
        this.shouldAttach = shouldAttach;
        this.parentInstanceFactory = parentInstanceFactory;

        this.set({
            instance: undefined,
            attach: [],
            assign: {},
        } as unknown as TInstanceState);
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            // make sure `instance()` is available before doing anything
            this.instanceReady(this.instance$);
        });
    }

    emitReady() {
        // only emit ready once to prevent reconstruct
        if (!this.hasEmittedReady) {
            this.ready.emit(this.instance);
            this.hasEmittedReady = true;
        }
    }

    protected destroy() {
        if ((this.instance as any)['isObject3D']) {
            const parentInstance = this.parentInstanceFactory?.();
            if (parentInstance && parentInstance['isObject3D']) {
                removeInteractivity(
                    this.__ngt__.root.bind(this.__ngt__),
                    this.instance as THREE.Object3D
                );
            }
        } else {
            // non scene object
            if (this.shouldAttach) {
                this.set((state) => ({
                    ...state,
                    instance: undefined,
                }));
                const previousAttach = this.__ngt__.previousAttach;
                if (previousAttach && typeof previousAttach === 'function') {
                    previousAttach();
                    if (this.__ngt__.parent) {
                        checkNeedsUpdate(this.__ngt__.parent);
                    }
                    checkNeedsUpdate(this.instance);
                } else {
                    this.attachToParent();
                }
            }
        }
    }

    override ngOnDestroy() {
        this.zone.runOutsideAngular(() => {
            this.destroy();
        });
        super.ngOnDestroy();
    }

    private readonly instanceReady = this.effect<TInstance>(
        tap(() => {
            // assigning
            this.assignToSelf(this.select((s) => s.assign));
            // attaching
            if (this.shouldAttach) {
                this.attachToParent();
            }
        })
    );

    private readonly assignToSelf = this.effect<UnknownRecord>(
        tap((assign) => {
            for (const [key, value] of Object.entries(assign)) {
                const keyParts = key.split('.');
                mutate(
                    this.instance as Record<string, unknown>,
                    keyParts,
                    value
                );
            }
        })
    );

    private attachToParent = this.effect<void>(
        pipe(
            withLatestFrom(this.select((s) => s.attach)),
            tap(([, attach]) => {
                if (!this.parentInstanceFactory) return;

                const parentInstance = this.parentInstanceFactory();
                if (!parentInstance) return;

                if (typeof attach === 'function') {
                    const attachCleanUp = attach(parentInstance, this.instance);
                    if (attachCleanUp) {
                        this.__ngt__.previousAttach = attachCleanUp;
                    }
                } else {
                    const propertyToAttach = [...attach];
                    if (propertyToAttach.length === 0) {
                        if (this.instance) {
                            if (isMaterial(this.instance)) {
                                propertyToAttach.push('material');
                            } else if (isGeometry(this.instance)) {
                                propertyToAttach.push('geometry');
                            }
                        }
                    }

                    if (propertyToAttach.length === 0) {
                        // TODO: warn users about invalid attach params
                        return;
                    }

                    mutate(parentInstance, propertyToAttach, this.instance);
                    if (this.__ngt__) {
                        this.__ngt__.root().invalidate();
                    } else if (parentInstance['__ngt__']) {
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
