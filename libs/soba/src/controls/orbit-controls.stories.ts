import {
    NgtComponentStore,
    NgtPortalModule,
    NgtStore,
    prepare,
    Ref,
    tapEffect,
} from '@angular-three/core';
import { NgtColorAttributeModule } from '@angular-three/core/attributes';
import {
    NgtBoxGeometryModule,
    NgtPlaneGeometryModule,
} from '@angular-three/core/geometries';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtSobaFBO } from '@angular-three/soba/misc';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectionStrategy,
    Component,
    NgModule,
    NgZone,
    OnInit,
} from '@angular/core';
import {
    componentWrapperDecorator,
    Meta,
    moduleMetadata,
    Story,
} from '@storybook/angular';
import * as THREE from 'three';
import { NgtSobaPerspectiveCameraModule } from '../../cameras/src';
import { setupCanvas, setupCanvasModules } from '../setup-canvas';

@Component({
    selector: 'custom-camera-story',
    template: `
        <ngt-mesh>
            <ngt-plane-geometry [args]="[4, 4, 4]"></ngt-plane-geometry>
            <ngt-mesh-basic-material
                [map]="(fboRef | async)?.texture"
            ></ngt-mesh-basic-material>
        </ngt-mesh>

        <ngt-portal [ref]="virtualScene">
            <ng-template ngt-portal-content>
                <ngt-mesh>
                    <ngt-box-geometry></ngt-box-geometry>
                    <ngt-mesh-basic-material
                        wireframe
                    ></ngt-mesh-basic-material>
                </ngt-mesh>

                <ngt-soba-perspective-camera
                    name="FBO Camera"
                    [ref]="virtualCamera"
                    [position]="[0, 0, 5]"
                ></ngt-soba-perspective-camera>
                <ngt-soba-orbit-controls
                    [camera]="virtualCamera.value"
                ></ngt-soba-orbit-controls>

                <ngt-color attach="background" color="blue"></ngt-color>
            </ng-template>
        </ngt-portal>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NgtSobaFBO],
})
class CustomCameraStory extends NgtComponentStore implements OnInit {
    fboRef = this.fbo.use(400, 400);

    virtualScene = new Ref(prepare(new THREE.Scene(), () => this.store.get()));
    virtualCamera = new Ref<THREE.PerspectiveCamera>();

    constructor(
        private fbo: NgtSobaFBO,
        private store: NgtStore,
        private zone: NgZone
    ) {
        super();
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                this.setBeforeRender();
            });
        });
    }

    private readonly setBeforeRender = this.effect<void>(
        tapEffect(() => {
            const unregister = this.store.registerBeforeRender({
                callback: ({ gl }) => {
                    if (this.virtualCamera.value && this.fboRef.value) {
                        gl.setRenderTarget(this.fboRef.value);
                        gl.render(
                            this.virtualScene.value,
                            this.virtualCamera.value
                        );

                        gl.setRenderTarget(null);
                    }
                },
            });

            return () => {
                unregister();
            };
        })
    );
}

@NgModule({
    declarations: [CustomCameraStory],
    exports: [CustomCameraStory],
    imports: [
        CommonModule,
        NgtMeshModule,
        NgtPlaneGeometryModule,
        NgtMeshBasicMaterialModule,
        NgtPortalModule,
        NgtBoxGeometryModule,
        NgtSobaPerspectiveCameraModule,
        NgtSobaOrbitControlsModule,
        NgtColorAttributeModule,
    ],
})
class CustomCameraStoryModule {}

export default {
    title: 'Controls/Orbit Controls',
    decorators: [
        componentWrapperDecorator(setupCanvas({ controls: false })),
        moduleMetadata({
            imports: [
                ...setupCanvasModules,
                NgtSobaOrbitControlsModule,
                NgtMeshModule,
                NgtBoxGeometryModule,
                NgtMeshBasicMaterialModule,
                CustomCameraStoryModule,
            ],
        }),
    ],
} as Meta;

export const Default: Story = () => ({
    template: `
        <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
        <ngt-mesh>
            <ngt-box-geometry></ngt-box-geometry>
            <ngt-mesh-basic-material wireframe></ngt-mesh-basic-material>
        </ngt-mesh>
    `,
});

export const CustomCamera: Story = () => ({
    template: `<custom-camera-story></custom-camera-story>`,
});

// import { createPortal, useFrame } from '@react-three/fiber'
// import React, { useRef, useState } from 'react'
// import { Scene } from 'three'
//
// import { Setup } from '../Setup'
// import { Box, OrbitControls, PerspectiveCamera, Plane, useFBO } from '../../src'
//
// import type { Camera } from 'three'
// import type { OrbitControlsProps } from '../../src'
//
// const args = {
//     enableDamping: true,
//     enablePan: true,
//     enableRotate: true,
//     enableZoom: true,
//     reverseOrbit: false,
// }
//
// export const OrbitControlsStory = (props: OrbitControlsProps) => (
//     <>
//         <OrbitControls {...props} />
// <Box>
// <meshBasicMaterial wireframe />
// </Box>
// </>
// )
//
// OrbitControlsStory.args = args
// OrbitControlsStory.storyName = 'Default'
//
// export default {
//     title: 'Controls/OrbitControls',
//     component: OrbitControls,
//     decorators: [(storyFn) => <Setup controls={false}>{storyFn()}</Setup>],
// }
//
// const CustomCamera = (props: OrbitControlsProps) => {
//     /**
//      * we will render our scene in a render target and use it as a map.
//      */
//     const fbo = useFBO(400, 400)
//     const virtualCamera = useRef<Camera>()
//     const [virtualScene] = useState(() => new Scene())
//
//     useFrame(({ gl }) => {
//         if (virtualCamera.current) {
//             gl.setRenderTarget(fbo)
//             gl.render(virtualScene, virtualCamera.current)
//
//             gl.setRenderTarget(null)
//         }
//     })
//
//     return (
//         <>
//             <Plane args={[4, 4, 4]}>
//     <meshBasicMaterial map={fbo.texture} />
//     </Plane>
//
//     {createPortal(
//         <>
//             <Box>
//                 <meshBasicMaterial wireframe />
//         </Box>
//
//         <PerspectiveCamera name="FBO Camera" ref={virtualCamera} position={[0, 0, 5]} />
//     <OrbitControls camera={virtualCamera.current} {...props} />
//
//         {/* @ts-ignore */}
//         <color attach="background" args={['hotpink']} />
//     </>,
//         virtualScene
//     )}
//     </>
// )
// }
//
// export const CustomCameraStory = (props: OrbitControlsProps) => <CustomCamera {...props} />
//
// CustomCameraStory.args = args
// CustomCameraStory.storyName = 'Custom Camera'
