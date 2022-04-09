import {
    NgtObject,
    NgtObjectState,
    provideObjectFactory,
    tapEffect,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
} from '@angular/core';
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
    @Input() set args(args: ConstructorParameters<typeof THREE.CubeCamera>) {
        this.set({ args });
    }

    @Input() set near(near: number) {
        this.set({ near });
    }

    @Input() set far(far: number) {
        this.set({ far });
    }

    @Input() set renderTarget(renderTarget: THREE.WebGLCubeRenderTarget) {
        this.set({ renderTarget });
    }

    protected override objectInitFn(): THREE.CubeCamera {
        const args = this.get((s) => s.args);
        return new THREE.CubeCamera(...args);
    }

    override ngOnInit() {
        const args = this.get((s) => s.args);
        if (args && args.length) {
            this.set({
                near: args[0],
                far: args[1],
                renderTarget: args[2],
            });
        }
        this.effect<NgtCubeCameraState['args']>(
            tapEffect(() => {
                this.init();
            })
        )(this.select((s) => s.args));
        super.ngOnInit();
    }

    protected override get subInputs(): Record<string, boolean> {
        return {
            near: false,
            far: false,
            renderTarget: false,
        };
    }
}

@NgModule({
    declarations: [NgtCubeCamera],
    exports: [NgtCubeCamera],
})
export class NgtCubeCameraModule {}
