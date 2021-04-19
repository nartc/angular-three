import type {
  AnyConstructor,
  ThreeColor,
  UnknownRecord,
} from '@angular-three/core';
import { CanvasStore, InstancesStore } from '@angular-three/core';
import { Directive, Input, NgZone, OnDestroy, SkipSelf } from '@angular/core';
import { Color, Material, MaterialParameters } from 'three';

@Directive()
export abstract class ThreeMaterial<
  TMaterial extends Material = Material,
  TMaterialParameters extends MaterialParameters = MaterialParameters
> implements OnDestroy {
  @Input() ngtId?: string;

  @Input() set parameters(v: TMaterialParameters | undefined) {
    if (v && this.material) {
      this.ngZone.runOutsideAngular(() => {
        this.convertColorToLinear(v);
        this.material.setValues(v);
        this.material.needsUpdate = true;
      });
    }
    this._parameters = v;
  }

  get parameters(): TMaterialParameters | undefined {
    return this._parameters;
  }

  private _parameters?: TMaterialParameters;

  constructor(
    protected readonly ngZone: NgZone,
    @SkipSelf() protected readonly instancesStore: InstancesStore,
    @SkipSelf() protected readonly canvasStore: CanvasStore
  ) {}

  abstract materialType: AnyConstructor<TMaterial>;

  private _material?: TMaterial;
  get material(): TMaterial {
    if (this._material == null) {
      this._material = new this.materialType(this.parameters);
      this.instancesStore.saveMaterial({
        id: this.ngtId,
        material: this._material,
      });
    }
    return this._material;
  }

  private convertColorToLinear(parameters: TMaterialParameters) {
    if ('color' in parameters) {
      const colorParams = (parameters as UnknownRecord)['color'] as ThreeColor;
      (parameters as UnknownRecord)['color'] = Array.isArray(colorParams)
        ? new Color(...colorParams)
        : new Color(colorParams);

      if (!this.canvasStore.getImperativeState().isLinear) {
        ((parameters as UnknownRecord)['color'] as Color).convertSRGBToLinear();
      }
    }
  }

  ngOnDestroy() {
    if (this.material) {
      this.instancesStore.removeMaterial(this.ngtId || this.material.uuid);
    }
  }
}
