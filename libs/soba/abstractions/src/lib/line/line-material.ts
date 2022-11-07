import {
  AnyConstructor,
  BooleanInput,
  checkNeedsUpdate,
  coerceBooleanProperty,
  coerceNumberProperty,
  make,
  NgtVector2,
  NumberInput,
  provideCommonMaterialRef,
  provideNgtCommonMaterial,
} from '@angular-three/core';
import { NgtShaderMaterial } from '@angular-three/core/materials';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { filter, tap } from 'rxjs';
import * as THREE from 'three';
import { LineMaterial } from 'three-stdlib';

@Component({
  selector: 'ngt-soba-line-material',
  standalone: true,
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtCommonMaterial(NgtSobaLineMaterial),
    provideCommonMaterialRef(NgtSobaLineMaterial),
  ],
})
export class NgtSobaLineMaterial extends NgtShaderMaterial {
  @Input() set dashed(dashed: BooleanInput) {
    this.set({ dashed: coerceBooleanProperty(dashed) });
  }

  @Input() set dashOffset(dashOffset: NumberInput) {
    this.set({ dashOffset: coerceNumberProperty(dashOffset) });
  }

  @Input() set dashScale(dashScale: NumberInput) {
    this.set({ dashScale: coerceNumberProperty(dashScale) });
  }

  @Input() set dashSize(dashSize: NumberInput) {
    this.set({ dashSize: coerceNumberProperty(dashSize) });
  }

  @Input() set gapSize(gapSize: NumberInput) {
    this.set({ gapSize: coerceNumberProperty(gapSize) });
  }

  @Input() set resolution(resolution: NgtVector2) {
    this.set({ resolution: make(THREE.Vector2, resolution) });
  }

  @Input() set color(color: THREE.ColorRepresentation) {
    this.set({ color });
  }

  override get materialType(): AnyConstructor<LineMaterial> {
    return LineMaterial;
  }

  readonly #setDashed = this.effect(
    tap(() => {
      const dashed = this.get((s) => s['dashed']);
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
    this.#setDashed(
      this.select(
        this.instance.pipe(filter((instance) => instance !== null)),
        this.select((s) => s['dashed'])
      )
    );
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      dashed: true,
      dashOffset: true,
      dashScale: true,
      dashSize: true,
      gapSize: true,
      resolution: true,
      color: true,
    };
  }
}
