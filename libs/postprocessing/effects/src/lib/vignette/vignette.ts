// GENERATED
import { AnyConstructor } from '@angular-three/core';
import {
    NgtCommonEffect,
    provideCommonEffectRef,
} from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { VignetteEffect } from 'postprocessing';

@Component({
    selector: 'ngt-vignette',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonEffectRef(NgtVignette)],
})
export class NgtVignette extends NgtCommonEffect<VignetteEffect> {
    static ngAcceptInputType_options:
        | ConstructorParameters<AnyConstructor<VignetteEffect>>[0]
        | undefined;

    override get effectType(): AnyConstructor<VignetteEffect> {
        return VignetteEffect;
    }
}

@NgModule({
    declarations: [NgtVignette],
    exports: [NgtVignette],
})
export class NgtVignetteModule {}
