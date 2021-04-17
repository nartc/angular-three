import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

@Directive({
  selector: 'ngt-renderPass',
  exportAs: 'ngtRenderPass',
  providers: [{ provide: ThreePass, useExisting: RenderPassDirective }],
})
export class RenderPassDirective extends ThreePass<RenderPass> {
  @Input() set args(v: ConstructorParameters<typeof RenderPass>) {
    this.extraArgs = v;
  }

  passType = RenderPass;

  protected get useSceneAndCamera(): boolean {
    return true;
  }
}
