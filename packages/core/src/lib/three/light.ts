import { Directive, Inject, Input, NgZone, OnInit } from '@angular/core';
import * as THREE from 'three';
import {
  NGT_OBJECT_WATCHED_CONTROLLER,
  NgtObject3dController,
} from '../controllers/object-3d.controller';
import type { AnyConstructor } from '../models';
import { applyProps } from '../utils/apply-props';

@Directive()
export abstract class NgtLight<TLight extends THREE.Light = THREE.Light>
  implements OnInit
{
  abstract lightType: AnyConstructor<TLight>;

  @Input() intensity?: number;
  @Input() shadow?: Partial<THREE.LightShadow>;

  constructor(
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    protected objectController: NgtObject3dController,
    protected ngZone: NgZone
  ) {}

  #lightArgs: unknown[] = [];
  protected set lightArgs(v: unknown | unknown[]) {
    this.#lightArgs = Array.isArray(v) ? v : [v];
    this.ngZone.runOutsideAngular(() => {
      this.objectController.init();
    });
  }

  #light!: TLight;

  ngOnInit() {
    this.objectController.initFn = () => {
      return this.ngZone.runOutsideAngular(() => {
        this.#light = new this.lightType(...this.#lightArgs);
        const props = {
          intensity: this.intensity,
          shadow: this.shadow,
        };
        applyProps(this.#light, props);

        return this.#light;
      });
    };

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
