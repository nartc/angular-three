// GENERATED
import type {
  LessFirstTwoConstructorParameters,
} from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

@Directive({
  selector: 'ngt-render-pass',
  exportAs: 'ngtRenderPass',
  providers: [{ provide: NgtPass, useExisting: NgtRenderPass }],
})
export class NgtRenderPass extends NgtPass<RenderPass> {
  static ngAcceptInputType_args:
    | LessFirstTwoConstructorParameters<ConstructorParameters<typeof RenderPass>> 
    | undefined;

  @Input() set args(v: LessFirstTwoConstructorParameters<ConstructorParameters<typeof RenderPass>> ) {
    this.extraArgs = v;
  }
  
  @Input() clearDepth?: boolean;

  passType = RenderPass;
  extraInputs = [
    'clearDepth',
  ];
  protected get useSceneAndCamera():
    | 'scene'
    | 'camera'
    | 'sceneAndCamera'
    | null {
    return 'sceneAndCamera';
  }
}
