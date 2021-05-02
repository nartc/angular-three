// GENERATED

import type { WithoutSceneCameraConstructorParameters } from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

@Directive({
  selector: 'ngt-render-pass',
  exportAs: 'ngtRenderPass',
  providers: [{ provide: ThreePass, useExisting: RenderPassDirective }],
})
export class RenderPassDirective extends ThreePass<RenderPass> {
  static ngAcceptInputType_args:
    | WithoutSceneCameraConstructorParameters<
        ConstructorParameters<typeof RenderPass>
      >
    | undefined;

  @Input() set args(
    v: WithoutSceneCameraConstructorParameters<
      ConstructorParameters<typeof RenderPass>
    >
  ) {
    this.extraArgs = v;
  }

  @Input() clearDepth?: boolean;

  passType = RenderPass;
  extraInputs = ['clearDepth'];
  protected get useSceneAndCamera():
    | 'scene'
    | 'camera'
    | 'sceneAndCamera'
    | null {
    return 'sceneAndCamera';
  }
}
