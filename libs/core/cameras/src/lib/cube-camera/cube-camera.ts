import {
    NgtObject,
    NgtPreObjectInit,
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

@Component({
    selector: 'ngt-cube-camera',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideObjectFactory<THREE.CubeCamera>(NgtCubeCamera)],
})
export class NgtCubeCamera extends NgtObject<THREE.CubeCamera> {
    @Input() set args(args: ConstructorParameters<typeof THREE.CubeCamera>) {
        this.set({ instanceArgs: args });
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
        const args = this.get((s) => s.instanceArgs) as ConstructorParameters<
            typeof THREE.CubeCamera
        >;
        return new THREE.CubeCamera(...args);
    }

    protected override get preObjectInit(): NgtPreObjectInit {
        return (initFn) => {
            const args = this.get((s) => s.instanceArgs);
            if (args && args.length) {
                this.set({
                    near: args[0],
                    far: args[1],
                    renderTarget: args[2],
                });
            }
            this.effect<unknown[]>(
                tapEffect(() => {
                    initFn();
                })
            )(this.instanceArgs$);
        };
    }

    protected override get optionFields(): Record<string, boolean> {
        return {
            ...super.optionFields,
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
