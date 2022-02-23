import { AnyConstructor, NgtCanvasStore, NgtStore } from '@angular-three/core';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import { NgtEffectComposerStore } from '@angular-three/postprocessing';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
    NgZone,
    OnInit,
    Optional,
} from '@angular/core';
import { BlendFunction, NormalPass, SSAOEffect } from 'postprocessing';
import { startWith, tap } from 'rxjs';
import * as THREE from 'three';

export interface NgtSSAOState {
    effect: SSAOEffect;
    options: ConstructorParameters<AnyConstructor<SSAOEffect>>[2];
}

@Component({
    selector: 'ngt-ssao',
    template: `
        <ngt-primitive
            *ngIf="effect$ | async as effect"
            [disabled]="true"
            [object]="$any(effect)"
            [dispose]="null"
        ></ngt-primitive>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSSAO extends NgtStore<NgtSSAOState> implements OnInit {
    @Input() set options(
        options: ConstructorParameters<AnyConstructor<SSAOEffect>>[2]
    ) {
        this.set({ options });
    }

    private props$ = this.select(
        this.select((s) => s.options).pipe(startWith({})),
        this.canvasStore.select((s) => s.camera),
        this.effectComposerStore.select((s) => s.normalPass),
        (options, camera, normalPass) => ({ options, camera, normalPass })
    );

    readonly effect$ = this.select((s) => s.effect);

    constructor(
        private canvasStore: NgtCanvasStore,
        private zone: NgZone,
        @Optional() private effectComposerStore: NgtEffectComposerStore
    ) {
        super();
        if (!effectComposerStore) {
            throw new Error(`Effects need to be inside of ngt-effect-composer`);
        }
    }

    get ssaoEffect() {
        return this.get((s) => s.effect);
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.canvasStore.ready$, () => {
                this.setEffect(this.props$);
            });
        });
    }

    private readonly setEffect = this.effect<{
        options: ConstructorParameters<AnyConstructor<SSAOEffect>>[2];
        camera: THREE.Camera;
        normalPass: NormalPass | undefined;
    }>(
        tap(({ camera, normalPass, options }) => {
            if (normalPass == null) {
                throw new Error(
                    'Please enable the NormalPass in the EffectComposer in order to use SSAO.'
                );
            }

            const effect = new SSAOEffect(
                camera,
                normalPass.renderTarget.texture,
                {
                    blendFunction: BlendFunction.MULTIPLY,
                    samples: 30,
                    rings: 4,
                    distanceThreshold: 1.0,
                    distanceFalloff: 0.0,
                    rangeThreshold: 0.5,
                    rangeFalloff: 0.1,
                    luminanceInfluence: 0.9,
                    radius: 20,
                    scale: 0.5,
                    bias: 0.5,
                    intensity: 1.0,
                    color: null,
                    ...options,
                }
            );

            this.effectComposerStore.set((state) => ({
                effects: [...state.effects, effect],
            }));
            this.set({ effect });
        })
    );
}

@NgModule({
    declarations: [NgtSSAO],
    exports: [NgtSSAO],
    imports: [NgtPrimitiveModule, CommonModule],
})
export class NgtSSAOModule {}
