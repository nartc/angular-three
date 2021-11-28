// GENERATED
import type {
  UnknownRecord,
} from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

@Directive({
  selector: 'ngt-unreal-bloom-pass',
  exportAs: 'ngtUnrealBloomPass',
  providers: [{ provide: NgtPass, useExisting: NgtUnrealBloomPass }],
})
export class NgtUnrealBloomPass extends NgtPass<UnrealBloomPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof UnrealBloomPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof UnrealBloomPass>) {
    this.extraArgs = v;
  }
  
  @Input() clearColor?: THREE.Color;
  @Input() renderTargetsHorizontal?: THREE.WebGLRenderTarget[];
  @Input() renderTargetsVertical?: THREE.WebGLRenderTarget[];
  @Input() nMips?: number;
  @Input() renderTargetBright?: THREE.WebGLRenderTarget;
  @Input() highPassUniforms?: UnknownRecord;
  @Input() materialHighPassFilter?: THREE.ShaderMaterial;
  @Input() separableBlurMaterials?: THREE.ShaderMaterial[];
  @Input() compositeMaterial?: THREE.ShaderMaterial;
  @Input() bloomTintColors?: THREE.Vector3[];
  @Input() copyUniforms?: UnknownRecord;
  @Input() materialCopy?: THREE.ShaderMaterial;
  @Input() oldClearColor?: THREE.Color;
  @Input() oldClearAlpha?: number;
  @Input() basic?: THREE.MeshBasicMaterial;
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
