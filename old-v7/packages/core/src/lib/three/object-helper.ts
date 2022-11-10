import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState, provideNgtInstance } from '../abstracts/instance';
import { injectObjectHostRef, injectObjectRef } from '../di/three';
import type { NgtAnyConstructor, NgtBooleanInput, NgtPrepareInstanceFn } from '../types';
import { coerceBoolean } from '../utils/coercion';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonObjectHelper<TObjectHelper extends THREE.Object3D = THREE.Object3D> extends NgtInstance<
  TObjectHelper,
  NgtInstanceState<TObjectHelper>
> {
  abstract get objectHelperType(): NgtAnyConstructor<TObjectHelper>;

  @Input() set helperVisible(helperVisible: NgtBooleanInput) {
    this.set({ helperVisible: coerceBoolean(helperVisible) });
  }

  override parentRef = injectObjectRef({ optional: true });
  override parentHostRef = injectObjectHostRef({ optional: true });

  override initialize() {
    super.initialize();
    this.set({ helperVisible: true });
  }

  override initFn(prepareInstance: NgtPrepareInstanceFn<TObjectHelper>): (() => void) | void | undefined {
    if (!this.parent || !this.parent.value || !this.parent.value['isObject3D']) {
      console.error('Parent is not an object3d');
      return;
    }

    const objectHelper = prepareInstance(
      new this.objectHelperType(this.parent.value, ...this.initInstanceArgs(this.instanceArgs))
    );

    const scene = this.store.getState((s) => s.scene);

    if (objectHelper && scene) {
      scene.add(objectHelper);
      const unregister = this.store.registerBeforeRender({
        callback: () => {
          if (objectHelper) {
            (
              objectHelper as unknown as TObjectHelper & {
                update: () => void;
              }
            ).update();
          }
        },
        obj: this.instanceRef,
      });
      return () => {
        if (objectHelper && scene) {
          scene.remove(objectHelper);
          unregister();
        }
      };
    }
  }

  override get optionsFields() {
    return [...super.optionsFields, 'helperVisible'];
  }
}

export const provideNgtCommonObjectHelper = createNgtProvider(NgtCommonObjectHelper, provideNgtInstance);
