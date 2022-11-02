import { DOCUMENT } from '@angular/common';
import {
  Directive,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { filter, Observable, of, pipe, tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';
import { injectInstanceHostRef, injectInstanceRef } from '../di/instance';
import { NgtRef } from '../ref';
import { NgtComponentStore, tapEffect } from '../stores/component-store';
import { NgtStore } from '../stores/store';
import type {
  BooleanInput,
  NgtAttachFunction,
  NgtInstanceLocalState,
  NgtInstanceNode,
  NgtStateGetter,
  UnknownRecord,
} from '../types';
import { NgtPrepareInstanceFn } from '../types';
import { applyProps } from '../utils/apply-props';
import { coerceBooleanProperty } from '../utils/coercion';
import { removeInteractivity } from '../utils/events';
import { createNgtProvider } from '../utils/inject';
import {
  checkUpdate,
  getInstanceInternal,
  optionsFieldsToOptions,
  prepare,
} from '../utils/instance';
import { is } from '../utils/is';
import { mutate } from '../utils/mutate';

export interface NgtInstanceState<TInstance extends object = UnknownRecord> {
  instanceRef: NgtRef<TInstance>;
  instanceArgs: unknown[];
  attach: string[] | NgtAttachFunction;
  noAttach: boolean;
  skipParent: boolean;
}

@Directive()
export abstract class NgtInstance<
    TInstance extends object = any,
    TInstanceState extends NgtInstanceState<TInstance> = NgtInstanceState<TInstance>
  >
  extends NgtComponentStore<TInstanceState>
  implements OnInit, OnDestroy
{
  @Input() set ref(instance: TInstance | NgtRef<TInstance>) {
    this.set({
      instanceRef: is.ref(instance) ? instance : new NgtRef(instance),
    });
  }

  @Input() set skipParent(skipParent: BooleanInput) {
    this.set({
      skipParent: coerceBooleanProperty(skipParent),
      skipParentExplicit: true,
    });
  }

  @Input() set noAttach(noAttach: BooleanInput) {
    this.set({
      noAttach: coerceBooleanProperty(noAttach),
      noAttachExplicit: true,
    });
  }

  @Input() set attach(
    value: string | string[] | NgtAttachFunction | undefined
  ) {
    if (value) {
      this.set({
        attach:
          typeof value === 'function' ? value : is.arr(value) ? value : [value],
        attachExplicit: true,
      });
    }
  }

  @Output() ready = new EventEmitter<TInstance>();
  @Output() update = new EventEmitter<TInstance>();

  protected readonly zone = inject(NgZone);
  protected readonly store = inject(NgtStore);
  protected readonly document = inject(DOCUMENT);

  protected parentRef = injectInstanceRef({ skipSelf: true, optional: true });
  protected parentHostRef = injectInstanceHostRef({
    skipSelf: true,
    optional: true,
  });

  protected isPrimitive = false;
  protected isWrapper = false;
  protected isRaw = false;

  #hasEmittedAlready = false;

  protected get optionsFields(): Record<string, boolean> {
    return {};
  }

  /**
   * Can be used by subclasses to run additional logic after options are set
   * @protected
   */
  protected postSetOptions: ((instance: TInstance) => void) | undefined;

  /**
   * Subclasses can customize this to run setOptions on custom trigger
   * @protected
   */
  protected setOptionsTrigger$: Observable<{}> = of({});

  readonly #init = this.effect(
    tapEffect(() => {
      const initFnReturn = this.initFn(this.#prepareInstance.bind(this));
      this.postInit();
      return initFnReturn;
    })
  );

  protected abstract initFn(
    prepareInstance: NgtPrepareInstanceFn<TInstance>
  ): (() => void) | void | undefined;

  protected initTrigger$: Observable<any> = this.instanceArgs$;

  readonly #instanceReady = this.effect(
    tapEffect(() => {
      // assigning
      const setOptionsSub = this.#setOptions(
        this.select(
          optionsFieldsToOptions(
            this,
            this.optionsFields,
            is.material(this.instanceValue)
          ),
          this.setOptionsTrigger$,
          (options) => options
        )
      );

      // attaching
      if (!this.get((s) => s.noAttach)) {
        this.#attachToParent();
      }

      // emitting
      if (!this.#hasEmittedAlready) {
        this.ready.emit(this.instanceValue);
        this.#hasEmittedAlready = true;
      }

      return () => {
        setOptionsSub.unsubscribe();
      };
    })
  );

  readonly #setOptions = this.effect<UnknownRecord>(
    tap((options) => {
      // no options; return early
      if (Object.keys(options).length === 0) return;

      if (this.instanceValue) {
        const state = this.get();
        const customOptions = {} as UnknownRecord;

        const { rotation, quarternion, ...restOptions } = options;

        if (rotation) {
          customOptions['rotation'] = state['rotation'];
        } else if (quarternion) {
          customOptions['quarternion'] = state['quarternion'];
        }

        for (const option of Object.keys(restOptions)) {
          const useOption = is.material(this.instanceValue)
            ? state[option] !== undefined
            : state[option] !== null;
          if (useOption) {
            customOptions[option] = state[option];
          }
        }

        if (is.material(this.instanceValue)) {
          // customOptions['uniforms'] = {};
          if ('uniforms' in this.instanceValue && 'uniforms' in restOptions) {
            customOptions['uniforms'] = {
              ...(this.instanceValue as THREE.ShaderMaterial)['uniforms'],
              ...(restOptions as THREE.ShaderMaterialParameters)['uniforms'],
            };
          }
          this.instanceValue.setValues(customOptions);
        } else {
          applyProps(this.instanceValue, customOptions);
        }

        if (this.postSetOptions) {
          this.postSetOptions(this.instanceValue);
        }

        checkUpdate(this.instanceValue);

        if (this.update.observed) {
          this.update.emit(this.instanceValue);
        }
      }
    })
  );

  readonly #attachToParent = this.effect<void>(
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
          const attachCleanUp = attach(parentInstanceRef, this.instance);
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
                (parentInstanceRef.value as unknown as THREE.Mesh).material
              )
            ) {
              (parentInstanceRef.value as unknown as THREE.Mesh).material = [];
            }
          }

          // return early if instance is material or geometry but parent isn't a Mesh
          if (
            (propertyToAttach[0] === 'material' ||
              propertyToAttach[0] === 'geometry') &&
            !is.mesh(parentInstanceRef.value)
          ) {
            return;
          }

          // retrieve the current value on the parentInstance, so we can reset it later
          this.__ngt__.previousAttachValue = propertyToAttach.reduce(
            (value, property) => value[property],
            parentInstanceRef.value
          );

          // attach the instance value on the parent
          mutate(parentInstanceRef.value, propertyToAttach, this.instanceValue);

          // validate on the instance
          if (this.__ngt__) {
            this.__ngt__.stateGetter().invalidate();
          }

          // also validate on the parentInstance
          if (parentInstanceRef.value.__ngt__) {
            parentInstanceRef.value.__ngt__.stateGetter().invalidate();
          }

          this.__ngt__.previousAttach = propertyToAttach;
          this.set({ attach: propertyToAttach });
        }

        checkUpdate(parentInstanceRef.value);
        checkUpdate(this.instanceValue);
      })
    )
  );

  /**
   * Subclasses can use this function to run pre-init logic
   * @protected
   */
  protected preInit() {
    return;
  }

  /**
   * Subclasses can use this function to run logic **before** NgtStore is ready
   * @protected
   */
  protected preStoreReady() {
    return;
  }

  /**
   * Subclasses can use this function to run post-init logic
   * @protected
   */
  protected postInit() {
    return;
  }

  /**
   * Can be used by subclasses to run additional logic after prepare
   * @protected
   */
  protected postPrepare(_: TInstance) {
    return;
  }

  /**
   * Subclasses can use this function to calculate instance arguments
   * @param instanceArgs
   * @protected
   */
  protected initInstanceArgs(instanceArgs: unknown[]) {
    return instanceArgs;
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      // set default
      this.set((s) => ({
        instanceRef: s.instanceRef || new NgtRef(null),
        instanceArgs: s.instanceArgs || [],
        attach: s.attach || [],
        noAttach: s.noAttach || false,
        skipParent: s.skipParent || false,
        noAttachExplicit: s['noAttachExplicit'] || false,
        skipParentExplicit: s['skipParentExplicit'] || false,
        attachExplicit: s['attachExplicit'] || false,
      }));

      // preStoreInit
      this.preStoreReady();

      this.store.onReady(() => {
        this.preInit();

        // run init
        this.#init(this.initTrigger$);

        // make sure `instance()` is available before doing anything
        this.#instanceReady(
          this.instance.pipe(filter((instance) => instance !== null))
        );
      });
    });
  }

  override ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      this.destroy();
    });
    super.ngOnDestroy();
  }

  protected destroy() {
    if (this.instanceValue) {
      if (is.object3d(this.instanceValue)) {
        const parentInstance = this.parent;
        if (parentInstance && is.object3d(parentInstance.value)) {
          removeInteractivity(
            this.__ngt__.stateGetter.bind(this.__ngt__),
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
              checkUpdate(this.__ngt__.parent.value);
            }
          } else {
            const previousAttachValue = this.__ngt__.previousAttachValue;
            if (this.__ngt__.parent && this.__ngt__.parent.value) {
              mutate(
                this.__ngt__.parent.value,
                previousAttach,
                previousAttachValue
              );
              checkUpdate(this.__ngt__.parent.value);
            }
          }
        }
      }

      const dispose = (this.instanceValue as UnknownRecord)['dispose'];
      if (dispose && typeof dispose === 'function') {
        dispose.apply(this.instanceValue);
      }
    }

    this.set({ attach: [] });
    this.instance.complete();
  }

  #prepareInstance(
    instance: TInstance,
    prepareOptions: {
      parentStateGetter?: NgtStateGetter;
      uuid?: string;
    } = {}
  ): NgtInstanceNode<TInstance> {
    if (!prepareOptions.parentStateGetter) {
      prepareOptions.parentStateGetter = this.store.get.bind(this.store);
    }

    if (prepareOptions.uuid && 'uuid' in instance) {
      (instance as UnknownRecord)['uuid'] = prepareOptions.uuid;
    }

    const prepInstance = prepare(
      instance,
      prepareOptions.parentStateGetter!,
      this.parent,
      this.instance,
      this.isPrimitive
    );

    this.postPrepare(prepInstance);

    this.instance.set(prepInstance);

    if (!is.object3d(prepInstance) && !this.noAttach && !this.skipParent) {
      const parentObjects =
        prepInstance.__ngt__.parent?.value?.__ngt__?.objects;
      parentObjects &&
        parentObjects.set([...parentObjects.value, this.instance]);
    }

    return prepInstance;
  }

  get instance(): NgtRef<TInstance> {
    return this.get((s) => s.instanceRef);
  }

  get instanceValue(): TInstance {
    return this.isRaw
      ? (this.instance.value.valueOf() as TInstance)
      : this.instance.value;
  }

  get instanceArgs$() {
    return this.select((s) => s.instanceArgs);
  }

  set instanceArgs(v: unknown | unknown[]) {
    this.set({ instanceArgs: is.arr(v) ? v : [v] });
  }

  get instanceArgs() {
    return this.get((s) => s.instanceArgs);
  }

  get __ngt__(): NgtInstanceLocalState {
    return getInstanceInternal(this.instance.value) as NgtInstanceLocalState;
  }

  get parent(): NgtRef {
    if (!this.get((s) => s.skipParent)) return this.parentRef?.();
    return this.parentHostRef?.() || this.parentRef?.();
  }
}

export const provideNgtInstance = createNgtProvider(NgtInstance);
