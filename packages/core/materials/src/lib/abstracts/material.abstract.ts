import { CanvasStore, InstancesStore } from '@angular-three/core';
import { ThreeColor } from '@angular-three/core/typings';
import { Directive, Input, SkipSelf } from '@angular/core';
import { Color, Material, MaterialParameters } from 'three';

@Directive()
export abstract class ThreeMaterial<
  TMaterial extends Material = Material,
  TMaterialParameters extends MaterialParameters = MaterialParameters
> {
  @Input() ngtId?: string;

  @Input() set parameters(v: TMaterialParameters | undefined) {
    if (v && this.material) {
      this.convertColorToLinear(v);
      this.material.setValues(v);
      this.material.needsUpdate = true;
    }
    this._parameters = v;
  }

  get parameters(): TMaterialParameters | undefined {
    return this._parameters;
  }

  private _parameters?: TMaterialParameters;

  constructor(
    @SkipSelf() protected readonly instancesStore: InstancesStore,
    @SkipSelf() protected readonly canvasStore: CanvasStore
  ) {}

  abstract init(): TMaterial;

  private _material?: TMaterial;
  get material(): TMaterial {
    if (this._material == null) {
      this._material = this.init();
      this.instancesStore.saveMaterial({
        id: this.ngtId,
        material: this._material,
      });
    }
    return this._material;
  }

  private convertColorToLinear(parameters: TMaterialParameters) {
    if ('color' in parameters) {
      const colorParams = (parameters as Record<string, unknown>)[
        'color'
      ] as ThreeColor;
      (parameters as Record<string, unknown>)['color'] = Array.isArray(
        colorParams
      )
        ? new Color(...colorParams)
        : new Color(colorParams);

      if (!this.canvasStore.getImperativeState().isLinear) {
        ((parameters as Record<string, unknown>)[
          'color'
        ] as Color).convertSRGBToLinear();
      }
    }
  }
}
