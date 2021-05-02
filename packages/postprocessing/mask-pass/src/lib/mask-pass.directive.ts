// GENERATED

import type { WithoutSceneCameraConstructorParameters } from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import { MaskPass } from 'three/examples/jsm/postprocessing/MaskPass';

@Directive({
  selector: 'ngt-mask-pass',
  exportAs: 'ngtMaskPass',
  providers: [{ provide: ThreePass, useExisting: MaskPassDirective }],
})
export class MaskPassDirective extends ThreePass<MaskPass> {
  static ngAcceptInputType_args:
    | WithoutSceneCameraConstructorParameters<
        ConstructorParameters<typeof MaskPass>
      >
    | undefined;

  @Input() set args(
    v: WithoutSceneCameraConstructorParameters<
      ConstructorParameters<typeof MaskPass>
    >
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
