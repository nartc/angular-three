import { createPassThroughInput } from '@angular-three/core';
import { Directive, Input, NgModule, Optional, Self } from '@angular/core';
import { NgtSpotLight } from '../spot-light/spot-light';

@Directive({
  selector: '[ngtSpotLightPassThrough]',
  standalone: true,
})
export class NgtSpotLightPassThrough {
  @Input() set ngtSpotLightPassThrough(wrapper: unknown) {
    NgtSpotLightPassThrough.assertWrapper(wrapper);

    const passThroughInput = createPassThroughInput(wrapper, this.host);

    passThroughInput('distance', true, true);
    passThroughInput('angle', true, true);
    passThroughInput('penumbra', true, true);
    passThroughInput('decay', true, true);
    passThroughInput('target', true, true);
    passThroughInput('power', true, true);
  }

  constructor(@Self() @Optional() private host: NgtSpotLight) {
    if (!host) return;
  }

  private static assertWrapper(wrapper: unknown): asserts wrapper is NgtSpotLight {
    if (!wrapper || !(wrapper instanceof NgtSpotLight)) {
      throw new Error('ngtSpotLightPassThrough wrapper is not a NgtSpotLight');
    }
  }
}

@NgModule({
  imports: [NgtSpotLightPassThrough],
  exports: [NgtSpotLightPassThrough],
})
export class NgtSpotLightPassThroughModule {}
