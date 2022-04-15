// GENERATED
import { AnyConstructor } from '@angular-three/core';
import {
    NgtCommonEffect,
    provideCommonEffectFactory,
} from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ToneMappingEffect } from 'postprocessing';

@Component({
    selector: 'ngt-tone-mapping',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonEffectFactory<ToneMappingEffect>(NgtToneMapping)],
})
export class NgtToneMapping extends NgtCommonEffect<ToneMappingEffect> {
    static ngAcceptInputType_options:
        | ConstructorParameters<AnyConstructor<ToneMappingEffect>>[0]
        | undefined;

    override get effectType(): AnyConstructor<ToneMappingEffect> {
        return ToneMappingEffect;
    }
}

@NgModule({
    declarations: [NgtToneMapping],
    exports: [NgtToneMapping],
})
export class NgtToneMappingModule {}
