import { NgtAnimationFrameStore, NgtStore } from '@angular-three/core';
import { Directive, Inject, NgZone, OnInit, Optional } from '@angular/core';
import * as THREE from 'three';
import { NGT_OBJECT_3D } from '../di/object3d';
import { EnhancedRxState } from '../stores/enhanced-rx-state';
import { AnyConstructor } from '../types';

@Directive()
export abstract class NgtObjectHelper<TObjectHelper extends THREE.Object3D>
  extends EnhancedRxState<{ args: unknown[] }>
  implements OnInit
{
  abstract objectHelperType: AnyConstructor<TObjectHelper>;

  protected set objectHelperArgs(v: unknown | unknown[]) {
    this.set({ args: Array.isArray(v) ? v : [v] });
  }

  constructor(
    @Optional() @Inject(NGT_OBJECT_3D) protected object3d: THREE.Object3D,
    protected store: NgtStore,
    protected animationFrameStore: NgtAnimationFrameStore,
    protected ngZone: NgZone
  ) {
    super();

    if (!object3d) {
      console.info('Parent is not an object3d');
      return;
    }

    this.set({ args: [] });
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.holdEffect(this.select('args'), (args) => {
        this.#objectHelper = new this.objectHelperType(this.object3d, ...args);

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
