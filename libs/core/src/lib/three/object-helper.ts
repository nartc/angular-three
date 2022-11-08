import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import {
  NgtInstance,
  NgtInstanceState,
  provideNgtInstance,
} from '../abstracts/instance';
import { injectObjectHostRef, injectObjectRef } from '../di/object';
import type {
  AnyConstructor,
  BooleanInput,
  NgtPrepareInstanceFn,
} from '../types';
import { coerceBooleanProperty } from '../utils/coercion';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonObjectHelper<
  TObjectHelper extends THREE.Object3D = THREE.Object3D
> extends NgtInstance<TObjectHelper, NgtInstanceState<TObjectHelper>> {
  abstract get objectHelperType(): AnyConstructor<TObjectHelper>;

  @Input() set helperVisible(helperVisible: BooleanInput) {
    this.set({ visible: coerceBooleanProperty(helperVisible) });
  }

  override parentRef = injectObjectRef({ optional: true });
  override parentHostRef = injectObjectHostRef({ optional: true });

  override preInit() {
    super.preInit();
    this.set((s) => ({
      visible: s['visible'] ?? true,
    }));
  }

  override initFn(
    prepareInstance: NgtPrepareInstanceFn<TObjectHelper>
  ): (() => void) | void | undefined {
    if (
      !this.parent ||
      !this.parent.value ||
      !this.parent.value['isObject3D']
    ) {
      console.error('Parent is not an object3d');
      return;
    }

    const instanceArgs = this.get((s) => s.instanceArgs);
    const objectHelper = prepareInstance(
      new this.objectHelperType(this.parent.value, ...instanceArgs)
    );

    const scene = this.store.get((s) => s.scene);

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
        obj: this.instance,
      });
      return () => {
        if (objectHelper && scene) {
          scene.remove(objectHelper);
          unregister();
        }
      };
    }
  }

  override get optionsFields(): Record<string, boolean> {
    return { ...super.optionsFields, visible: false };
  }
}

export const provideNgtCommonObjectHelper = createNgtProvider(
  NgtCommonObjectHelper,
  provideNgtInstance
);
