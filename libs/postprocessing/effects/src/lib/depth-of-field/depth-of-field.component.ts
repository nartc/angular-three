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
    providers: [NgtStore],
})
export class NgtDepthOfField {
    @Input() set options(
        options: ConstructorParameters<AnyConstructor<DepthOfFieldEffect>>[1]
    ) {
        this.store.set({ options });
    }

    @Input() set target(target: NgtVector3) {
        this.store.set({ target });
    }

    @Input() set depthTexture(depthTexture: {
        texture: THREE.Texture;
        packing: number;
    }) {
        this.store.set({ depthTexture });
    }

    @Input() set blur(blur: number) {
        this.store.set({ blur });
    }

    private props$ = this.store.select(
        this.store.select((s) => s.blur).pipe(startWithUndefined()),
        this.store.select((s) => s.options).pipe(startWith({})),
        this.effectComposerStore.select((s) => s.camera),
        (blur, options, camera) => ({ blur, options, camera })
    );

    private target$ = this.store.select(
        this.store.select((s) => s.depthTexture).pipe(startWithUndefined()),
        this.store.select((s) => s.target).pipe(startWithUndefined()),
        this.store.select((s) => s.effect),
        (depthTexture, target, effect) => ({ depthTexture, target, effect })
    );

    readonly effect$ = this.store.select((s) => s.effect);

    @Output() ready = this.effect$;

    constructor(
        private store: NgtStore<NgtDepthOfFieldState>,
        private canvasStore: NgtCanvasStore,
        private zone: NgZone,
        @Optional() private effectComposerStore: NgtEffectComposerStore
    ) {}

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.store.onCanvasReady(this.canvasStore.ready$, () => {
                this.setEffect(this.props$);
                this.setEffectTarget(this.target$);
            });
        });
    }

    get effect() {
        return this.store.get((s) => s.effect);
    }

    private readonly setEffect = this.store.effect<{
        blur: number;
        options: ConstructorParameters<AnyConstructor<DepthOfFieldEffect>>[1];
        camera: THREE.Camera;
    }>(
        tap(({ camera, blur, options }) => {
            const effect = new DepthOfFieldEffect(camera, { ...options, blur });
            this.effectComposerStore.set((state) => ({
                effects: [...state.effects, effect],
            }));
            this.store.set({ effect });
        })
    );

    private readonly setEffectTarget = this.store.effect<
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
