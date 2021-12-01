import {
  AfterContentInit,
  Directive,
  Inject,
  Input,
  NgZone,
} from '@angular/core';
import * as THREE from 'three';
import {
  NGT_OBJECT_WATCHED_CONTROLLER,
  NgtObject3dController,
} from '../controllers/object-3d.controller';
import type { AnyConstructor, UnknownRecord } from '../models';
import { applyProps } from '../utils/apply-props';

@Directive()
export abstract class NgtLight<TLight extends THREE.Light = THREE.Light>
  implements AfterContentInit
{
  abstract lightType: AnyConstructor<TLight>;

  @Input() intensity?: number;
  @Input() shadow?: Partial<THREE.LightShadow>;

  constructor(
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    protected objectController: NgtObject3dController,
    protected ngZone: NgZone
  ) {
    objectController.initFn = () => {
      return this.ngZone.runOutsideAngular(() => {
        this.#light = new this.lightType(...this.#lightArgs);
        if (this.intensity) {
          applyProps(this.light, { intensity: this.intensity });
        }

        if (this.shadow) {
          applyProps(this.light, this.shadow as unknown as UnknownRecord);
        }

        return this.#light;
      });
    };
  }

  #lightArgs: unknown[] = [];
  protected set lightArgs(v: unknown | unknown[]) {
    this.#lightArgs = Array.isArray(v) ? v : [v];
    this.ngZone.runOutsideAngular(() => {
      this.objectController.init();
    });
  }

  #light!: TLight;

  ngAfterContentInit() {
    this.ngZone.runOutsideAngular(() => {
      if (!this.#light) {
        this.objectController.init();
      }
    });
  }

  get light() {
    return this.#light;
  }
}
