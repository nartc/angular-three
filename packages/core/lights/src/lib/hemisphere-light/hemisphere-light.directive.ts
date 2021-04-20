import { ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { HemisphereLight } from 'three';
import { ThreeLight } from '../abstracts';

@Directive({
  selector: 'ngt-hemisphereLight',
  exportAs: 'ngtHemisphereLight',
  providers: [
    { provide: ThreeObject3d, multi: true, useExisting: HemisphereLightDirective },
  ],
})
export class HemisphereLightDirective extends ThreeLight<HemisphereLight> {
  @Input() set args(v: ConstructorParameters<typeof HemisphereLight>) {
    this.extraArgs = v;
  }

  lightType = HemisphereLight;
}
