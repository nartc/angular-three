import { Directive, Inject, OnInit } from '@angular/core';
import * as THREE from 'three';
import { NGT_OBJECT } from '../di/object';
import { NgtAnimationFrameStore } from '../stores/animation-frame';
import { NgtCanvasStore } from '../stores/canvas';
import { NgtStore } from '../stores/store';
import type { AnyConstructor, AnyFunction } from '../types';
import { zonelessRequestAnimationFrame } from '../utils/zoneless-timer';

@Directive()
export abstract class NgtObjectHelper<TObjectHelper extends THREE.Object3D>
  extends NgtStore<{ args: unknown[] }>
  implements OnInit
{
  abstract objectHelperType: AnyConstructor<TObjectHelper>;

  protected set objectHelperArgs(v: unknown | unknown[]) {
    this.set({ args: Array.isArray(v) ? v : [v] });
  }

  _object?: THREE.Object3D;

  constructor(
    @Inject(NGT_OBJECT)
    protected objectFn: AnyFunction,
    protected canvasStore: NgtCanvasStore,
    protected animationFrameStore: NgtAnimationFrameStore
  ) {
    super();
  }

  ngOnInit() {
    zonelessRequestAnimationFrame(() => {
      this._object = this.objectFn();

      if (!this._object) {
        console.info('Parent is not an object3d');
        return;
      }

      this.effect(this.select('args'), (args) => {
        this._objectHelper = new this.objectHelperType(this._object, ...args);
        const scene = this.canvasStore.get('scene');
        if (this.objectHelper && scene) {
          scene.add(this.objectHelper);
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
            if (this.objectHelper && scene) {
              scene.remove(this.objectHelper);
              this.animationFrameStore.actions.unregister(animationUuid);
            }
          };
        }

        return;
      });
    });
  }

  private _objectHelper?: TObjectHelper;
  get objectHelper() {
    return this._objectHelper;
  }
}
