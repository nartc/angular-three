// GENERATED
import { AnyConstructor } from '@angular-three/core';
import {
    NgtCommonEffect,
    provideCommonEffectRef,
} from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { DotScreenEffect } from 'postprocessing';

@Component({
    selector: 'ngt-dot-screen',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonEffectRef(NgtDotScreen)],
})
export class NgtDotScreen extends NgtCommonEffect<DotScreenEffect> {
    static ngAcceptInputType_options:
        | ConstructorParameters<AnyConstructor<DotScreenEffect>>[0]
        | undefined;

    override get effectType(): AnyConstructor<DotScreenEffect> {
        return DotScreenEffect;
    }
}

@NgModule({
    declarations: [NgtDotScreen],
    exports: [NgtDotScreen],
})
export class NgtDotScreenModule {}
