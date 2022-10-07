import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState, provideNgtInstance } from '../abstracts/instance';
import { injectObjectHostRef, injectObjectRef } from '../di/object';
import { tapEffect } from '../stores/component-store';
import { AnyConstructor, BooleanInput } from '../types';
import { coerceBooleanProperty } from '../utils/coercion';
import { createNgtProvider } from '../utils/inject';

@Directive()
export abstract class NgtCommonObjectHelper<TObjectHelper extends THREE.Object3D> extends NgtInstance<
  TObjectHelper,
  NgtInstanceState<TObjectHelper>
> {
  abstract get objectHelperType(): AnyConstructor<TObjectHelper>;

  @Input() set helperVisible(helperVisible: BooleanInput) {
    this.set({ visible: coerceBooleanProperty(helperVisible) });
  }

  protected override parentRef = injectObjectRef({ optional: true });
  protected override parentHostRef = injectObjectHostRef({ optional: true });

  protected override preInit() {
    super.preInit();
    this.set((state) => ({
      visible: state['visible'] ?? true,
    }));
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() => {
        this.init(this.instanceArgs$);
        this.postInit();
      });
    });
  }

  private readonly init = this.effect<unknown[]>(
    tapEffect((instanceArgs) => {
      if (!this.parent || !this.parent.value) {
        console.info('Parent is not an object3d');
        return;
      }

      const objectHelper = this.prepareInstance(new this.objectHelperType(this.parent.value, ...instanceArgs));

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
      return;
    })
  );

  protected override get optionFields(): Record<string, boolean> {
    return { ...super.optionFields, visible: false };
  }
}

export const provideNgtCommonObjectHelper = createNgtProvider(NgtCommonObjectHelper, provideNgtInstance);
