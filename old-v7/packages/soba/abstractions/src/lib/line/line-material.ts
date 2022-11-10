import {
  checkNeedsUpdate,
  coerceBoolean,
  coerceNumber,
  make,
  NgtAnyConstructor,
  NgtBooleanInput,
  NgtNumberInput,
  NgtVector2,
  provideCommonMaterialRef,
  provideNgtCommonMaterial,
} from '@angular-three/core';
import { NgtShaderMaterial } from '@angular-three/core/materials';
import { Component, Input } from '@angular/core';
import { filter, tap } from 'rxjs';
import * as THREE from 'three';
import { LineMaterial } from 'three-stdlib';

@Component({
  selector: 'ngt-soba-line-material',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonMaterial(NgtSobaLineMaterial), provideCommonMaterialRef(NgtSobaLineMaterial)],
})
export class NgtSobaLineMaterial extends NgtShaderMaterial {
  @Input() set dashed(dashed: NgtBooleanInput) {
    this.set({ dashed: coerceBoolean(dashed) });
  }

  @Input() set dashOffset(dashOffset: NgtNumberInput) {
    this.set({ dashOffset: coerceNumber(dashOffset) });
  }

  @Input() set dashScale(dashScale: NgtNumberInput) {
    this.set({ dashScale: coerceNumber(dashScale) });
  }

  @Input() set dashSize(dashSize: NgtNumberInput) {
    this.set({ dashSize: coerceNumber(dashSize) });
  }

  @Input() set gapSize(gapSize: NgtNumberInput) {
    this.set({ gapSize: coerceNumber(gapSize) });
  }

  @Input() set resolution(resolution: NgtVector2) {
    this.set({ resolution: make(THREE.Vector2, resolution) });
  }

  @Input() set color(color: THREE.ColorRepresentation) {
    this.set({ color });
  }

  override get materialType(): NgtAnyConstructor<LineMaterial> {
    return LineMaterial;
  }

  private readonly setDashed = this.effect(
    tap(() => {
      const dashed = this.getState((s) => s['dashed']);
      if (dashed) {
        this.instanceValue.defines['USE_DASH'] = '';
      } else {
        // Setting lineMaterial.defines.USE_DASH to undefined is apparently not sufficient.
        delete this.instanceValue.defines['USE_DASH'];
      }
      checkNeedsUpdate(this.instanceValue);
    })
  );

  override postInit() {
    super.postInit();
    this.setDashed(
      this.select(
        this.instanceRef.pipe(filter((instance) => instance !== null)),
        this.select((s) => s['dashed']),
        this.defaultProjector
      )
    );
  }

  override get optionsFields() {
    return [...super.optionsFields, 'dashed', 'dashOffset', 'dashScale', 'dashSize', 'gapSize', 'resolution', 'color'];
  }
}
