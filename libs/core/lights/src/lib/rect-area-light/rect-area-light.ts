// GENERATED
import {
    AnyConstructor,
    NgtCommonLight,
    provideCommonLightFactory,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-rect-area-light',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonLightFactory<THREE.RectAreaLight>(NgtRectAreaLight),
    ],
})
export class NgtRectAreaLight extends NgtCommonLight<THREE.RectAreaLight> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.RectAreaLight>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.RectAreaLight>) {
        this.instanceArgs = v;
    }

    @Input() set width(width: number) {
        this.set({ width });
    }

    @Input() set height(height: number) {
        this.set({ height });
    }

    @Input() set power(power: number) {
        this.set({ power });
    }

    override get lightType(): AnyConstructor<THREE.RectAreaLight> {
        return THREE.RectAreaLight;
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
            width: true,
            height: true,
            power: true,
        };
    }
}

@NgModule({
    declarations: [NgtRectAreaLight],
    exports: [NgtRectAreaLight],
})
export class NgtRectAreaLightModule {}
