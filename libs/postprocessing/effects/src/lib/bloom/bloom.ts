// GENERATED
import { AnyConstructor } from '@angular-three/core';
import {
    NgtCommonEffect,
    provideCommonEffectRef,
} from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { BlendFunction, BloomEffect } from 'postprocessing';

@Component({
    selector: 'ngt-bloom',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonEffectRef(NgtBloom)],
})
export class NgtBloom extends NgtCommonEffect<BloomEffect> {
    static ngAcceptInputType_options:
        | ConstructorParameters<AnyConstructor<BloomEffect>>[0]
        | undefined;

    override get effectType(): AnyConstructor<BloomEffect> {
        return BloomEffect;
    }

    protected override get defaultBlendMode(): BlendFunction {
        return BlendFunction.SCREEN;
    }
}

@NgModule({
    declarations: [NgtBloom],
    exports: [NgtBloom],
})
export class NgtBloomModule {}
