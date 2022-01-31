import { Directive, Input, OnInit, Optional } from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor } from '../types';
import { zonelessRequestAnimationFrame } from '../utils/zoneless-timer';
import { NgtGeometry } from './geometry';

@Directive()
export abstract class NgtCurve<
  TCurve extends THREE.Curve<THREE.Vector> = THREE.Curve<THREE.Vector>
> implements OnInit
{
  @Input() divisions?: number;

  abstract curveType: AnyConstructor<TCurve>;

  private _curveArgs: unknown[] = [];

  protected set curveArgs(v: unknown | unknown[]) {
    this._curveArgs = Array.isArray(v) ? v : [v];
    this.init();
  }

  constructor(@Optional() protected geometryDirective: NgtGeometry) {}

  private _curve?: TCurve;

  ngOnInit() {
    if (!this.curve) {
      this.init();
    }
  }

  private init() {
    zonelessRequestAnimationFrame(() => {
      this._curve = new this.curveType(...this._curveArgs);
      if (this.curve && this.geometryDirective) {
        const points = this.curve.getPoints(this.divisions);
        this.geometryDirective.geometry.setFromPoints(
          points as unknown as THREE.Vector3[] | THREE.Vector2[]
        );
      }
    });
  }

  get curve(): TCurve | undefined {
    return this._curve;
  }
}
