// GENERATED
import { AnyConstructor } from '@angular-three/core';
import {
    NgtCommonEffect,
    provideCommonEffectRef,
} from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ToneMappingEffect } from 'postprocessing';

@Component({
    selector: 'ngt-tone-mapping',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonEffectRef(NgtToneMapping)],
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
