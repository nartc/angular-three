import { Directive, Inject, NgZone, OnInit } from '@angular/core';
import { requestAnimationFrame } from '@rx-angular/cdk/zone-less';
import * as THREE from 'three';
import { NGT_OBJECT_3D } from '../di/object3d';
import { NgtAnimationFrameStore } from '../stores/animation-frame.store';
import { EnhancedRxState } from '../stores/enhanced-rx-state';
import { NgtStore } from '../stores/store';
import { AnyConstructor, AnyFunction } from '../types';

@Directive()
export abstract class NgtObjectHelper<TObjectHelper extends THREE.Object3D>
  extends EnhancedRxState<{ args: unknown[] }>
  implements OnInit
{
  abstract objectHelperType: AnyConstructor<TObjectHelper>;

  protected set objectHelperArgs(v: unknown | unknown[]) {
    this.set({ args: Array.isArray(v) ? v : [v] });
  }

  #object3d?: THREE.Object3D;

  constructor(
    @Inject(NGT_OBJECT_3D)
    protected object3dFn: AnyFunction<THREE.Object3D>,
    protected store: NgtStore,
    protected animationFrameStore: NgtAnimationFrameStore,
    protected ngZone: NgZone
  ) {
    super();
    this.set({ args: [] });
  }

  ngOnInit() {
    requestAnimationFrame(() => {
      this.#object3d = this.object3dFn();

      if (!this.#object3d) {
        console.info('Parent is not an object3d');
        return;
      }

      this.holdEffect(this.select('args'), (args) => {
        this.#objectHelper = new this.objectHelperType(this.#object3d, ...args);

        this.store.get('scene').add(this.objectHelper!);
        const animationUuid = this.animationFrameStore.register({
          callback: () => {
            if (this.objectHelper) {
              (
                this.objectHelper as TObjectHelper & { update: () => void }
              ).update();
            }
          },
        });

        return () => {
          if (this.objectHelper) {
            this.store.get('scene').remove(this.objectHelper);
            this.animationFrameStore.actions.unsubscriberUuid(animationUuid);
          }
        };
      });
    });
  }

  #objectHelper?: TObjectHelper;
  get objectHelper() {
    return this.#objectHelper;
  }
}
