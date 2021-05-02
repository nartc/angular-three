// GENERATED

import type { UnknownRecord } from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type {
  Color,
  WebGLRenderTarget,
  ShaderMaterial,
  Vector3,
  MeshBasicMaterial,
} from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

@Directive({
  selector: 'ngt-unreal-bloom-pass',
  exportAs: 'ngtUnrealBloomPass',
  providers: [{ provide: ThreePass, useExisting: UnrealBloomPassDirective }],
})
export class UnrealBloomPassDirective extends ThreePass<UnrealBloomPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof UnrealBloomPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof UnrealBloomPass>) {
    this.extraArgs = v;
  }

  @Input() clearColor?: Color;
  @Input() renderTargetsHorizontal?: WebGLRenderTarget[];
  @Input() renderTargetsVertical?: WebGLRenderTarget[];
  @Input() nMips?: number;
  @Input() renderTargetBright?: WebGLRenderTarget;
  @Input() highPassUniforms?: UnknownRecord;
  @Input() materialHighPassFilter?: ShaderMaterial;
  @Input() separableBlurMaterials?: ShaderMaterial[];
  @Input() compositeMaterial?: ShaderMaterial;
  @Input() bloomTintColors?: Vector3[];
  @Input() copyUniforms?: UnknownRecord;
  @Input() materialCopy?: ShaderMaterial;
  @Input() oldClearColor?: Color;
  @Input() oldClearAlpha?: number;
  @Input() basic?: MeshBasicMaterial;
  @Input() fsQuad?: UnknownRecord;

  passType = UnrealBloomPass;
  extraInputs = [
    'clearColor',
    'renderTargetsHorizontal',
    'renderTargetsVertical',
    'nMips',
    'renderTargetBright',
    'highPassUniforms',
    'materialHighPassFilter',
    'separableBlurMaterials',
    'compositeMaterial',
    'bloomTintColors',
    'copyUniforms',
    'materialCopy',
    'oldClearColor',
    'oldClearAlpha',
    'basic',
    'fsQuad',
  ];
}
