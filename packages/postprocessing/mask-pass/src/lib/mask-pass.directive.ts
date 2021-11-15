// GENERATED
import type { LessFirstTwoConstructorParameters } from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import { MaskPass } from 'three/examples/jsm/postprocessing/MaskPass';

@Directive({
  selector: 'ngt-mask-pass',
  exportAs: 'ngtMaskPass',
  providers: [{ provide: NgtPass, useExisting: NgtMaskPass }],
})
export class NgtMaskPass extends NgtPass<MaskPass> {
  static ngAcceptInputType_args:
    | LessFirstTwoConstructorParameters<ConstructorParameters<typeof MaskPass>>
    | undefined;

  @Input() set args(
    v: LessFirstTwoConstructorParameters<ConstructorParameters<typeof MaskPass>>
  ) {
    this.extraArgs = v;
  }

  @Input() inverse?: boolean;

  passType = MaskPass;
  extraInputs = ['inverse'];
  protected get useSceneAndCamera():
    | 'scene'
    | 'camera'
    | 'sceneAndCamera'
    | null {
    return 'sceneAndCamera';
  }
}
