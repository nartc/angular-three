// GENERATED
import { AnyConstructor } from '@angular-three/core';
import {
    NgtCommonEffect,
    provideCommonEffectFactory,
} from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { BrightnessContrastEffect } from 'postprocessing';

@Component({
    selector: 'ngt-brightness-contrast',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonEffectFactory<BrightnessContrastEffect>(
            NgtBrightnessContrast
        ),
    ],
})
export class NgtBrightnessContrast extends NgtCommonEffect<BrightnessContrastEffect> {
    static ngAcceptInputType_options:
        | ConstructorParameters<AnyConstructor<BrightnessContrastEffect>>[0]
        | undefined;

    override get effectType(): AnyConstructor<BrightnessContrastEffect> {
        return BrightnessContrastEffect;
    }
}

@NgModule({
    declarations: [NgtBrightnessContrast],
    exports: [NgtBrightnessContrast],
})
export class NgtBrightnessContrastModule {}
