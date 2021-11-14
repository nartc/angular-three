import { Directive, Input, NgZone, OnInit, Optional } from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor } from '../models';
import { NgtGeometry } from './geometry';

@Directive()
export abstract class NgtCurve<
  TCurve extends THREE.Curve<THREE.Vector> = THREE.Curve<THREE.Vector>
> implements OnInit
{
  @Input() divisions?: number;

  abstract curveType: AnyConstructor<TCurve>;

  private _extraArgs: unknown[] = [];

  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
    this.ngZone.runOutsideAngular(() => {
      this.init();
    });
  }

  protected constructor(
    protected ngZone: NgZone,
    @Optional() protected geometryDirective?: NgtGeometry
  ) {}

  private _curve?: TCurve;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (!this.curve) {
        this.init();
      }
    });
  }

  private init() {
    this._curve = new this.curveType(...this._extraArgs);
    if (this.curve && this.geometryDirective) {
      const points = this.curve.getPoints(this.divisions);
      this.geometryDirective.geometry.setFromPoints(
        points as unknown as THREE.Vector3[] | THREE.Vector2[]
      );
    }
  }

  get curve(): TCurve | undefined {
    return this._curve;
  }
}
