import { NgtRadianPipeModule } from '@angular-three/core';
import { NgtValueAttributeModule } from '@angular-three/core/attributes';
import { NgtPlaneGeometryModule } from '@angular-three/core/geometries';
import { NgtAxesHelperModule } from '@angular-three/core/helpers';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaSkyModule } from '@angular-three/soba/staging';
import {
    componentWrapperDecorator,
    Meta,
    moduleMetadata,
    Story,
} from '@storybook/angular';
import { setupCanvas, setupCanvasModules } from '../setup-canvas';

export default {
    title: 'Staging/Sky',
    decorators: [
        componentWrapperDecorator(setupCanvas()),
        moduleMetadata({
            imports: [
                ...setupCanvasModules,
                NgtSobaSkyModule,
                NgtAxesHelperModule,
                NgtMeshModule,
                NgtPlaneGeometryModule,
                NgtMeshBasicMaterialModule,
                NgtRadianPipeModule,
                NgtValueAttributeModule,
            ],
        }),
    ],
} as Meta;

export const Default: Story = () => ({
    template: `
        <ngt-soba-sky></ngt-soba-sky>
        <ngt-mesh>
            <ngt-value [attach]="['rotation', 'x']" [value]="90 | radian"></ngt-value>
            <ngt-plane-geometry [args]="[100, 100, 4, 4]"></ngt-plane-geometry>
            <ngt-mesh-basic-material color="black" wireframe></ngt-mesh-basic-material>
        </ngt-mesh>
        <ngt-axes-helper></ngt-axes-helper>
    `,
});
