import {
  AnyConstructor,
  BooleanInput,
  checkNeedsUpdate,
  coerceBooleanProperty,
  coerceNumberProperty,
  makeVector2,
  NgtVector2,
  NumberInput,
  provideCommonMaterialRef,
} from '@angular-three/core';
import { NgtShaderMaterial } from '@angular-three/core/materials';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
import { LineMaterial } from 'three-stdlib';

@Component({
  selector: 'ngt-soba-line-material',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonMaterialRef(NgtSobaLineMaterial)],
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
    this.set({ resolution: makeVector2(resolution) });
  }

  @Input() set color(color: THREE.ColorRepresentation) {
    this.set({ color });
  }

  override get materialType(): AnyConstructor<LineMaterial> {
    return LineMaterial;
  }

  protected override postInit() {
    this.setDashed(this.setDashedParams$);
  }

  private readonly setDashedParams$ = this.select(
    this.instance,
    this.select((s) => s['dashed'])
  );

  private readonly setDashed = this.effect(
    tap(() => {
      const { instance: material, dashed } = this.get();
      if (dashed) {
        material.value.defines['USE_DASH'] = '';
      } else {
        // Setting lineMaterial.defines.USE_DASH to undefined is apparently not sufficient.
        delete material.value.defines['USE_DASH'];
      }
      checkNeedsUpdate(material.value);
    })
  );

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
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

@NgModule({
  imports: [NgtSobaLineMaterial],
  exports: [NgtSobaLineMaterial],
})
export class NgtSobaLineMaterialModule {}
