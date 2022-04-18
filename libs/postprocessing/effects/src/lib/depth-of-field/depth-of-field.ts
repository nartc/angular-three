import {
    AnyConstructor,
    coerceNumberProperty,
    NgtVector3,
    NumberInput,
    UnknownRecord,
} from '@angular-three/core';
import {
    NgtCommonEffect,
    provideCommonEffectRef,
} from '@angular-three/postprocessing';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import { DepthOfFieldEffect } from 'postprocessing';
import { tap } from 'rxjs';
import * as THREE from 'three';

@Component({
    selector: 'ngt-depth-of-field',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonEffectRef(NgtDepthOfField)],
})
export class NgtDepthOfField extends NgtCommonEffect<DepthOfFieldEffect> {
    static ngAcceptInputType_options:
        | ConstructorParameters<AnyConstructor<DepthOfFieldEffect>>[1]
        | undefined;

    override get effectType(): AnyConstructor<DepthOfFieldEffect> {
        return DepthOfFieldEffect;
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

    @Input() set blur(blur: NumberInput) {
        this.set({ blur: coerceNumberProperty(blur) });
    }

    private readonly targetParams$ = this.select(
        this.select((s) => s.instance.value),
        this.select((s) => s['target']),
        this.select((s) => s['depthTexture']),
        () => ({})
    );

    protected override adjustCtorParams(instanceArgs: unknown[]): unknown[] {
        const camera = this.effectComposer.get((s) => s.camera);
        const blur = this.get((s) => s['blur']);
        return [camera, { ...(instanceArgs[0] as UnknownRecord), blur }];
    }

    protected override get ctorParams$() {
        return this.select(
            this.effectComposer.select((s) => s.camera),
            this.instanceArgs$,
            () => ({})
        );
    }

    protected override get skipSetEffectOptions(): boolean {
        return true;
    }

    protected override postInit() {
        this.setTarget(this.targetParams$);
    }

    private readonly setTarget = this.effect<{}>(
        tap(() => {
            const invalidate = this.store.get((s) => s.invalidate);
            const effect = this.get((s) => s.instance);
            const target = this.get((s) => s['target']);
            const depthTexture = this.get((s) => s['depthTexture']);
            if (effect.value) {
                if (target) {
                    effect.value.target =
                        target instanceof THREE.Vector3
                            ? new THREE.Vector3().set(
                                  target.x,
                                  target.y,
                                  target.z
                              )
                            : new THREE.Vector3(
                                  target[0],
                                  target[1],
                                  target[2]
                              );
                }

                if (depthTexture) {
                    effect.value.setDepthTexture(
                        depthTexture.texture,
                        depthTexture.packing
                    );
                }
            }

            invalidate();
        })
    );
}

@NgModule({
    declarations: [NgtDepthOfField],
    exports: [NgtDepthOfField],
})
export class NgtDepthOfFieldModule {}
