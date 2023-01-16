import { NgtAnyConstructor, NgtArgs } from '@angular-three/core';
import { NgtpEffect } from '@angular-three/postprocessing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DotScreenEffect } from 'postprocessing';

@Component({
    selector: 'ngtp-dot-screen',
    standalone: true,
    template: `<ngt-primitive *args="[get('effect')]" ngtCompound />`,
    imports: [NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    inputs: ['angle', 'scale'],
})
export class NgtpDotScreen extends NgtpEffect<DotScreenEffect> {
    override get effectConstructor(): NgtAnyConstructor<DotScreenEffect> {
        return DotScreenEffect;
    }
}
