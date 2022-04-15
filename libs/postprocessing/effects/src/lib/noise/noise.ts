// GENERATED
import { AnyConstructor } from '@angular-three/core';
import {
    NgtCommonEffect,
    provideCommonEffectFactory,
} from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { BlendFunction, NoiseEffect } from 'postprocessing';

@Component({
    selector: 'ngt-noise',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonEffectFactory<NoiseEffect>(NgtNoise)],
})
export class NgtNoise extends NgtCommonEffect<NoiseEffect> {
    static ngAcceptInputType_options:
        | ConstructorParameters<AnyConstructor<NoiseEffect>>[0]
        | undefined;

    override get effectType(): AnyConstructor<NoiseEffect> {
        return NoiseEffect;
    }

    protected override get defaultBlendMode(): BlendFunction {
        return BlendFunction.COLOR_DODGE;
    }
}

@NgModule({
    declarations: [NgtNoise],
    exports: [NgtNoise],
})
export class NgtNoiseModule {}
