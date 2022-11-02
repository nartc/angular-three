import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import {
  NgtInstance,
  NgtInstanceState,
  provideNgtInstance,
} from '../abstracts/instance';
import { injectObjectHostRef, injectObjectRef } from '../di/object';
import type { AnyConstructor, BooleanInput, NgtInstanceNode } from '../types';
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

  protected override parentRef = injectObjectRef({ optional: true });
  protected override parentHostRef = injectObjectHostRef({ optional: true });

  override preInit() {
    this.set((s) => ({
      visible: s['visible'] ?? true,
    }));
  }

  protected override initFn(
    prepareInstance: (
      instance: TObjectHelper,
      uuid?: string
    ) => NgtInstanceNode<TObjectHelper>
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

  protected override get optionsFields(): Record<string, boolean> {
    return { ...super.optionsFields, visible: false };
  }
}

export const provideNgtCommonObjectHelper = createNgtProvider(
  NgtCommonObjectHelper,
  provideNgtInstance
);
