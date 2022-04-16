// GENERATED
import { AnyConstructor } from '@angular-three/core';
import {
    NgtCommonEffect,
    provideCommonEffectRef,
} from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { HueSaturationEffect } from 'postprocessing';

@Component({
    selector: 'ngt-hue-saturation',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonEffectRef(NgtHueSaturation)],
})
export class NgtHueSaturation extends NgtCommonEffect<HueSaturationEffect> {
    static ngAcceptInputType_options:
        | ConstructorParameters<AnyConstructor<HueSaturationEffect>>[0]
        | undefined;

    override get effectType(): AnyConstructor<HueSaturationEffect> {
        return HueSaturationEffect;
    }
}

@NgModule({
    declarations: [NgtHueSaturation],
    exports: [NgtHueSaturation],
})
export class NgtHueSaturationModule {}
