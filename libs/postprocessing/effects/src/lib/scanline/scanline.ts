// GENERATED
import { AnyConstructor } from '@angular-three/core';
import {
    NgtCommonEffect,
    provideCommonEffectFactory,
} from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { BlendFunction, ScanlineEffect } from 'postprocessing';

@Component({
    selector: 'ngt-scanline',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonEffectFactory<ScanlineEffect>(NgtScanline)],
})
export class NgtScanline extends NgtCommonEffect<ScanlineEffect> {
    static ngAcceptInputType_options:
        | ConstructorParameters<AnyConstructor<ScanlineEffect>>[0]
        | undefined;

    override get effectType(): AnyConstructor<ScanlineEffect> {
        return ScanlineEffect;
    }

    protected override get defaultBlendMode(): BlendFunction {
        return BlendFunction.OVERLAY;
    }
}

@NgModule({
    declarations: [NgtScanline],
    exports: [NgtScanline],
})
export class NgtScanlineModule {}
