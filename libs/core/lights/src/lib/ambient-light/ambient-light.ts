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
    selector: 'ngt-ambient-light',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonLightFactory<THREE.AmbientLight>(NgtAmbientLight)],
})
export class NgtAmbientLight extends NgtCommonLight<THREE.AmbientLight> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.AmbientLight>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.AmbientLight>) {
        this.instanceArgs = v;
    }

    override get lightType(): AnyConstructor<THREE.AmbientLight> {
        return THREE.AmbientLight;
    }
}

@NgModule({
    declarations: [NgtAmbientLight],
    exports: [NgtAmbientLight],
})
export class NgtAmbientLightModule {}
