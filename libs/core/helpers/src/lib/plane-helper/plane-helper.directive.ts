// GENERATED
import {
    createParentObjectProvider,
    NgtHelper,
    NGT_OBJECT_CONTROLLER_PROVIDER,
    NgtObjectControllerModule,
} from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
    selector: 'ngt-plane-helper',
    exportAs: 'ngtPlaneHelper',
    providers: [
        {
            provide: NgtHelper,
            useExisting: NgtPlaneHelper,
        },
        NGT_OBJECT_CONTROLLER_PROVIDER,
        createParentObjectProvider(NgtPlaneHelper, (parent) => parent.helper),
    ],
})
export class NgtPlaneHelper extends NgtHelper<THREE.PlaneHelper> {
    static ngAcceptInputType_args:
        | ConstructorParameters<typeof THREE.PlaneHelper>
        | undefined;

    @Input() set args(v: ConstructorParameters<typeof THREE.PlaneHelper>) {
        this.helperArgs = v;
    }

    helperType = THREE.PlaneHelper;
}

@NgModule({
    declarations: [NgtPlaneHelper],
    exports: [NgtPlaneHelper, NgtObjectControllerModule],
})
export class NgtPlaneHelperModule {}
