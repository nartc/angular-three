// GENERATED
import { AnyConstructor } from '@angular-three/core';
import {
    NgtCommonEffect,
    provideCommonEffectFactory,
} from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { DepthEffect } from 'postprocessing';

@Component({
    selector: 'ngt-depth',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonEffectFactory<DepthEffect>(NgtDepth)],
})
export class NgtDepth extends NgtCommonEffect<DepthEffect> {
    static ngAcceptInputType_options:
        | ConstructorParameters<AnyConstructor<DepthEffect>>[0]
        | undefined;

    override get effectType(): AnyConstructor<DepthEffect> {
        return DepthEffect;
    }
}

@NgModule({
    declarations: [NgtDepth],
    exports: [NgtDepth],
})
export class NgtDepthModule {}
