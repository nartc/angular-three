import { NgtAnyConstructor, NgtArgs } from '@angular-three/core';
import { NgtpEffect } from '@angular-three/postprocessing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BlendFunction, NoiseEffect } from 'postprocessing';

@Component({
    selector: 'ngtp-noise',
    standalone: true,
    template: `<ngt-primitive *args="[get('effect')]" ngtCompound />`,
    imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    inputs: ['premultiply'],
})
export class NgtpNoise extends NgtpEffect<NoiseEffect> {
    override get effectConstructor(): NgtAnyConstructor<NoiseEffect> {
        return NoiseEffect;
    }

    override defaultBlendMode: BlendFunction = BlendFunction.COLOR_DODGE;
}
