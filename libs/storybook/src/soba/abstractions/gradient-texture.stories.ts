import { NgtSidePipeModule } from '@angular-three/core';
import { NgtPlaneGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaGradientTextureModule } from '@angular-three/soba/abstractions';
import {
    componentWrapperDecorator,
    Meta,
    moduleMetadata,
} from '@storybook/angular';
import { setupCanvas, setupCanvasModules } from '../../setup-canvas';

export default {
    title: 'Soba/Abstractions/Gradient Texture',
    decorators: [
        componentWrapperDecorator(setupCanvas()),
        moduleMetadata({
            imports: [
                ...setupCanvasModules,
                NgtSobaGradientTextureModule,
                NgtMeshModule,
                NgtMeshBasicMaterialModule,
                NgtPlaneGeometryModule,
                NgtSidePipeModule,
            ],
        }),
    ],
} as Meta;

export const Default = () => ({
    template: `
        <ngt-mesh>
            <ngt-plane-geometry></ngt-plane-geometry>
            <ngt-mesh-basic-material [parameters]='{depthWrite: false, side: "double"|side}'>
                <ngt-soba-gradient-texture [stops]="[0, 1]" [colors]='["aquamarine", "hotpink"]'></ngt-soba-gradient-texture>
            </ngt-mesh-basic-material>
        </ngt-mesh>
    `,
});
