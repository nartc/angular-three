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
    selector: 'ngt-hemisphere-light-probe',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideCommonLightFactory<THREE.HemisphereLightProbe>(
            NgtHemisphereLightProbe
        ),
    ],
})
export class NgtHemisphereLightProbe extends NgtCommonLight<THREE.HemisphereLightProbe> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.HemisphereLightProbe>
        | undefined;

    @Input() set args(
        v: ConstructorParameters<typeof THREE.HemisphereLightProbe>
    ) {
        this.lightArgs = v;
    }

    @Input() set skyColor(skyColor: THREE.ColorRepresentation) {
        this.set({ skyColor });
    }

    @Input() set groundColor(groundColor: THREE.ColorRepresentation) {
        this.set({ groundColor });
    }

    override get lightType(): AnyConstructor<THREE.HemisphereLightProbe> {
        return THREE.HemisphereLightProbe;
    }

    protected override get subInputs(): Record<string, boolean> {
        return {
            ...super.subInputs,
            skyColor: true,
            groundColor: true,
        };
    }
}

@NgModule({
    declarations: [NgtHemisphereLightProbe],
    exports: [NgtHemisphereLightProbe],
})
export class NgtHemisphereLightProbeModule {}
