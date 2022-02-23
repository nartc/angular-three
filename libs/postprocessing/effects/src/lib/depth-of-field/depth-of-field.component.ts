import {
    AnyConstructor,
    NgtCanvasStore,
    NgtStore,
    NgtVector3,
    startWithUndefined,
} from '@angular-three/core';
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
    Output,
} from '@angular/core';
import { DepthOfFieldEffect } from 'postprocessing';
import { startWith, tap } from 'rxjs';
import * as THREE from 'three';

export interface NgtDepthOfFieldState {
    effect: DepthOfFieldEffect;
    options: ConstructorParameters<AnyConstructor<DepthOfFieldEffect>>[1];
    target: NgtVector3;
    depthTexture: {
        texture: THREE.Texture;
        packing: number;
    };
    blur: number;
}

@Component({
    selector: 'ngt-depth-of-field',
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
export class NgtDepthOfField
    extends NgtStore<NgtDepthOfFieldState>
    implements OnInit
{
    @Input() set options(
        options: ConstructorParameters<AnyConstructor<DepthOfFieldEffect>>[1]
    ) {
        this.set({ options });
    }

    @Input() set target(target: NgtVector3) {
        this.set({ target });
    }

    @Input() set depthTexture(depthTexture: {
        texture: THREE.Texture;
        packing: number;
    }) {
        this.set({ depthTexture });
    }

    @Input() set blur(blur: number) {
        this.set({ blur });
    }

    private props$ = this.select(
        this.select((s) => s.blur).pipe(startWithUndefined()),
        this.select((s) => s.options).pipe(startWith({})),
        this.effectComposerStore.select((s) => s.camera),
        (blur, options, camera) => ({ blur, options, camera })
    );

    private target$ = this.select(
        this.select((s) => s.depthTexture).pipe(startWithUndefined()),
        this.select((s) => s.target).pipe(startWithUndefined()),
        this.select((s) => s.effect),
        (depthTexture, target, effect) => ({ depthTexture, target, effect })
    );

    readonly effect$ = this.select((s) => s.effect);

    @Output() ready = this.effect$;

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

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.canvasStore.ready$, () => {
                this.setEffect(this.props$);
                this.setEffectTarget(this.target$);
            });
        });
    }

    get depthOfFieldEffect() {
        return this.get((s) => s.effect);
    }

    private readonly setEffect = this.effect<{
        blur: number;
        options: ConstructorParameters<AnyConstructor<DepthOfFieldEffect>>[1];
        camera: THREE.Camera;
    }>(
        tap(({ camera, blur, options }) => {
            const effect = new DepthOfFieldEffect(camera, { ...options, blur });
            this.effectComposerStore.set((state) => ({
                effects: [...state.effects, effect],
            }));
            this.set({ effect });
        })
    );

    private readonly setEffectTarget = this.effect<
        Pick<NgtDepthOfFieldState, 'depthTexture' | 'target' | 'effect'>
    >(
        tap(({ effect, target, depthTexture }) => {
            if (target) {
                effect.target =
                    target instanceof THREE.Vector3
                        ? new THREE.Vector3().set(target.x, target.y, target.z)
                        : new THREE.Vector3().set(
                              ...(target as [number, number, number])
                          );
            }

            if (depthTexture)
                effect.setDepthTexture(
                    depthTexture.texture,
                    depthTexture.packing
                );
        })
    );
}

@NgModule({
    declarations: [NgtDepthOfField],
    exports: [NgtDepthOfField],
    imports: [NgtPrimitiveModule, CommonModule],
})
export class NgtDepthOfFieldModule {}
