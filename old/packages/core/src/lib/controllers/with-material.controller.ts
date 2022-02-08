// GENERATED
import { ContentChild, Directive, Input, NgModule } from '@angular/core';
import * as THREE from 'three';
import { NgtMaterial } from '../three/material';
import { zonelessRequestAnimationFrame } from '../utils/zoneless-timer';
import { Controller, createControllerProviderFactory } from './controller';

@Directive({
  selector: `
    ngt-mesh,
    ngt-instanced-mesh,
    ngt-skinned-mesh,
    ngt-line,
    ngt-line-loop,
    ngt-line-segments,
    ngt-soba-text,,
    ngt-points
  `,
  exportAs: 'ngtWithMaterialController',
})
export class NgtWithMaterialController extends Controller {
  private _materialInput?: THREE.Material | THREE.Material[] | undefined;

  @Input() set material(v: THREE.Material | THREE.Material[] | undefined) {
    if (v) {
      if (!(Array.isArray(v) && !v.length)) {
        this._materialInput = v;
      }
      this.construct();
    }
  }

  @Input() withMaterialController?: NgtWithMaterialController;

  @ContentChild(NgtMaterial, { static: true }) set contentMaterial(
    dir: NgtMaterial
  ) {
    if (dir) {
      zonelessRequestAnimationFrame(() => {
        this.material = dir.material;
      });
    }
  }

  get material() {
    return this._material;
  }

  private _material: THREE.Material | THREE.Material[] | undefined = undefined;

  construct() {
    this._material = NgtWithMaterialController.getMaterial(this._materialInput);
  }

  private static getMaterial(
    input: THREE.Material | THREE.Material[] | undefined
  ): THREE.Material | THREE.Material[] | undefined {
    if (Array.isArray(input)) {
      if (!input.length) return undefined;

      if (input[0] instanceof THREE.Material) {
        return input as THREE.Material[];
      }
    }

    if (input instanceof THREE.Material) {
      return input;
    }

    return undefined;
  }

  override get inputControllerProps(): [string[], Controller | undefined] {
    return [['material'], this.withMaterialController];
  }
}

@NgModule({
  declarations: [NgtWithMaterialController],
  exports: [NgtWithMaterialController],
})
export class NgtWithMaterialControllerModule {}

export const [
  NGT_WITH_MATERIAL_WATCHED_CONTROLLER,
  NGT_WITH_MATERIAL_CONTROLLER_PROVIDER,
] = createControllerProviderFactory({
  controller: NgtWithMaterialController,
  watchedControllerTokenName: 'Watched WithMaterialController',
});
