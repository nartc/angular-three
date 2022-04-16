// GENERATED
import { AnyConstructor } from '@angular-three/core';
import {
    NgtCommonEffect,
    provideCommonEffectRef,
} from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ShockWaveEffect } from 'postprocessing';

@Component({
    selector: 'ngt-shock-wave',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonEffectRef(NgtShockWave)],
})
export class NgtShockWave extends NgtCommonEffect<ShockWaveEffect> {
    static ngAcceptInputType_options:
        | ConstructorParameters<AnyConstructor<ShockWaveEffect>>[0]
        | undefined;

    override get effectType(): AnyConstructor<ShockWaveEffect> {
        return ShockWaveEffect;
    }
}

@NgModule({
    declarations: [NgtShockWave],
    exports: [NgtShockWave],
})
export class NgtShockWaveModule {}
