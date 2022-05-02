import {
  AnyConstructor,
  checkNeedsUpdate,
  coerceNumberProperty,
  NgtCommonMesh,
  NgtVector3,
  NumberInput,
  Ref,
} from '@angular-three/core';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  Input,
  NgModule,
  TemplateRef,
} from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
import { Sky } from 'three-stdlib';

export function calcPosFromAngles(inclination: number, azimuth: number, vector: THREE.Vector3 = new THREE.Vector3()) {
  const theta = Math.PI * (inclination - 0.5);
  const phi = 2 * Math.PI * (azimuth - 0.5);

  vector.x = Math.cos(phi);
  vector.y = Math.sin(theta);
  vector.z = Math.sin(phi);

  return vector;
}

@Directive({
  selector: 'ng-template[ngt-soba-sky-content]',
})
export class NgtSobaSkyContent {
  constructor(public templateRef: TemplateRef<{ sky: Ref<Sky> }>) {}

  static ngTemplateContextGuard(dir: NgtSobaSkyContent, ctx: any): ctx is { sky: Ref<Sky> } {
    return true;
  }
}

@Component({
  selector: 'ngt-soba-sky',
  template: `
    <ng-container
      *ngIf="content"
      [ngTemplateOutlet]="content.templateRef"
      [ngTemplateOutletContext]="{ sky: instance }"
    ></ng-container>
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaSky extends NgtCommonMesh<Sky> {
  @Input() set distance(distance: NumberInput) {
    this.set({ distance: coerceNumberProperty(distance) });
  }

  @Input() set sunPosition(sunPosition: NgtVector3) {
    this.set({ sunPosition });
  }

  @Input() set inclination(inclination: NumberInput) {
    this.set({ inclination: coerceNumberProperty(inclination) });
  }

  @Input() set azimuth(azimuth: NumberInput) {
    this.set({ azimuth: coerceNumberProperty(azimuth) });
  }

  @Input() set mieCoefficient(mieCoefficient: NumberInput) {
    this.set({ mieCoefficient: coerceNumberProperty(mieCoefficient) });
  }

  @Input() set mieDirectionalG(mieDirectionalG: NumberInput) {
    this.set({ mieDirectionalG: coerceNumberProperty(mieDirectionalG) });
  }

  @Input() set rayleigh(rayleigh: NumberInput) {
    this.set({ rayleigh: coerceNumberProperty(rayleigh) });
  }

  @Input() set turbidity(turbidity: NumberInput) {
    this.set({ turbidity: coerceNumberProperty(turbidity) });
  }

  @ContentChild(NgtSobaSkyContent) content?: NgtSobaSkyContent;

  protected override preInit(): void {
    super.preInit();
    this.set((state) => {
      const inclination = state['inclination'] ?? 0.6;
      const azimuth = state['azimuth'] ?? 0.1;
      return {
        inclination,
        azimuth,
        distance: state['distance'] ?? 1000,
        mieCoefficient: state['mieCoefficient'] ?? 0.005,
        mieDirectionalG: state['mieDirectionalG'] ?? 0.8,
        rayleigh: state['rayleigh'] ?? 0.5,
        turbidity: state['turbidity'] ?? 10,
        sunPosition: state['sunPosition'] ?? calcPosFromAngles(inclination, azimuth),
      };
    });
  }

  protected override postInit(): void {
    super.postInit();
    this.setScale(this.select((s) => s['distance']));
    this.updateMaterialUniforms(
      this.select(
        this.select((s) => s['mieCoefficient']),
        this.select((s) => s['mieDirectionalG']),
        this.select((s) => s['rayleigh']),
        this.select((s) => s['sunPosition']),
        this.select((s) => s['turbidity'])
      )
    );
  }

  private readonly setScale = this.effect<{}>(
    tap(() => {
      const distance = this.get((s) => s['distance']);
      this.instance.value.scale.copy(new THREE.Vector3().setScalar(distance));
    })
  );

  private readonly updateMaterialUniforms = this.effect<{}>(
    tap(() => {
      const { mieCoefficient, mieDirectionalG, rayleigh, sunPosition, turbidity } = this.get();

      const material = this.instance.value.material as THREE.ShaderMaterial;
      material.uniforms['mieCoefficient'].value = mieCoefficient;
      material.uniforms['mieDirectionalG'].value = mieDirectionalG;
      material.uniforms['rayleigh'].value = rayleigh;
      material.uniforms['sunPosition'].value = sunPosition;
      material.uniforms['turbidity'].value = turbidity;

      checkNeedsUpdate(material);
    })
  );

  get meshType(): AnyConstructor<Sky> {
    return Sky;
  }
}

@NgModule({
  declarations: [NgtSobaSky, NgtSobaSkyContent],
  exports: [NgtSobaSky, NgtSobaSkyContent],
  imports: [CommonModule],
})
export class NgtSobaSkyModule {}
