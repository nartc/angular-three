import { ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { DirectionalLight } from 'three';
import { ThreeLight } from '../abstracts';

@Directive({
  selector: 'ngt-directionalLight',
  exportAs: 'ngtDirectionalLight',
  providers: [
    { provide: ThreeObject3d,  useExisting: DirectionalLightDirective },
  ],
})
export class DirectionalLightDirective extends ThreeLight<DirectionalLight> {
  @Input() set args(v: ConstructorParameters<typeof DirectionalLight>) {
    this.extraArgs = v;
  }

  lightType = DirectionalLight;
}
