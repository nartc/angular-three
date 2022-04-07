import {
    NgtObject,
    NgtObjectState,
    provideObjectFactory,
    tapEffect,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

export interface NgtCubeCameraState extends NgtObjectState<THREE.CubeCamera> {
    args: ConstructorParameters<typeof THREE.CubeCamera>;
}

@Component({
    selector: 'ngt-cube-camera',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideObjectFactory<THREE.CubeCamera, NgtCubeCameraState>(
            NgtCubeCamera
        ),
    ],
})
export class NgtCubeCamera extends NgtObject<
    THREE.CubeCamera,
    NgtCubeCameraState
> {
    protected override objectInitFn(): THREE.CubeCamera {
        const args = this.get((s) => s.args);
        return new THREE.CubeCamera(...args);
    }

    override ngOnInit() {
        this.effect<NgtCubeCameraState['args']>(
            tapEffect(() => {
                this.init();
            })
        )(this.select((s) => s.args));
        super.ngOnInit();
    }
}

@NgModule({
    declarations: [NgtCubeCamera],
    exports: [NgtCubeCamera],
})
export class NgtCubeCameraModule {}
