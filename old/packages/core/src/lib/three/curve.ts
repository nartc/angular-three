import { Directive, Input, NgZone, OnInit, Optional } from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor } from '../types';
import { NgtGeometry } from './geometry';

@Directive()
export abstract class NgtCurve<
  TCurve extends THREE.Curve<THREE.Vector> = THREE.Curve<THREE.Vector>
> implements OnInit
{
  @Input() divisions?: number;

  abstract curveType: AnyConstructor<TCurve>;

  #curveArgs: unknown[] = [];

  protected set curveArgs(v: unknown | unknown[]) {
    this.#curveArgs = Array.isArray(v) ? v : [v];
    this.ngZone.runOutsideAngular(() => {
      this.#init();
    });
  }

  constructor(
    protected ngZone: NgZone,
    @Optional() protected geometryDirective: NgtGeometry | null
  ) {}

  #curve?: TCurve;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (!this.curve) {
        this.#init();
      }
    });
  }

  #init() {
    this.#curve = new this.curveType(...this.#curveArgs);
    if (this.curve && this.geometryDirective) {
      const points = this.curve.getPoints(this.divisions);
      this.geometryDirective.geometry.setFromPoints(
        points as unknown as THREE.Vector3[] | THREE.Vector2[]
      );
    }
  }

  get curve(): TCurve | undefined {
    return this.#curve;
  }
}
