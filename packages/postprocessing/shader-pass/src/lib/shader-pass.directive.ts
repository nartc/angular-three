import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type { ShaderMaterial } from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

@Directive({
  selector: 'ngt-shaderPass',
  exportAs: 'ngtShaderPass',
  providers: [{ provide: ThreePass, useExisting: ShaderPassDirective }],
})
export class ShaderPassDirective extends ThreePass<ShaderPass> {
  @Input() set args(v: ConstructorParameters<typeof ShaderPass>) {
    this.extraArgs = v;
  }

  @Input() uniforms?: { [name: string]: { value: any } };
  @Input() material?: ShaderMaterial;
  @Input() fsQuad?: object;

  passType = ShaderPass;
  extraInputs = ['uniforms', 'material', 'fsQuad'];
}
