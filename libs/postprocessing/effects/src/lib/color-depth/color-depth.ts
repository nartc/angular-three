// GENERATED
import { AnyConstructor } from '@angular-three/core';
import {
    NgtCommonEffect,
    provideCommonEffectFactory,
} from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ColorDepthEffect } from 'postprocessing';

@Component({
    selector: 'ngt-color-depth',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonEffectFactory<ColorDepthEffect>(NgtColorDepth)],
})
export class NgtColorDepth extends NgtCommonEffect<ColorDepthEffect> {
    static ngAcceptInputType_options:
        | ConstructorParameters<AnyConstructor<ColorDepthEffect>>[0]
        | undefined;

    override get effectType(): AnyConstructor<ColorDepthEffect> {
        return ColorDepthEffect;
    }
}

@NgModule({
    declarations: [NgtColorDepth],
    exports: [NgtColorDepth],
})
export class NgtColorDepthModule {}
