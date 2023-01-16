import { NgtAnyConstructor, NgtArgs } from '@angular-three/core';
import { NgtpEffect } from '@angular-three/postprocessing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BlendFunction, BloomEffect } from 'postprocessing';

@Component({
    selector: 'ngtp-bloom',
    standalone: true,
    template: `<ngt-primitive *args="[get('effect')]" ngtCompound />`,
    imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    inputs: [
        'mipmapBlur',
        'luminanceThreshold',
        'luminanceSmoothing',
        'intensity',
        'resolutionScale',
        'resolutionX',
        'resolutionY',
        'width',
        'height',
        'kernelSize',
    ],
})
export class NgtpBloom extends NgtpEffect<BloomEffect> {
    override get effectConstructor(): NgtAnyConstructor<BloomEffect> {
        return BloomEffect;
    }

    override defaultBlendMode: BlendFunction = BlendFunction.ADD;
}
