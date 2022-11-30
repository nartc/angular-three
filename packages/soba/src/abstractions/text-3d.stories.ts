import { NgtMeshNormalMaterial } from '@angular-three/core/materials';
import { SobaText3D } from '@angular-three/soba/abstractions';
import { SobaCenter } from '@angular-three/soba/staging';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { createRangeControl } from '../create-control';
import { setupCanvas, setupCanvasImports } from '../setup-canvas';

export default {
    title: 'Abstractions/Text 3D',
    decorators: [
        componentWrapperDecorator(setupCanvas({ camera: { position: [0, 0, 10] } })),
        moduleMetadata({ imports: [setupCanvasImports, NgtMeshNormalMaterial, SobaText3D, SobaCenter] }),
    ],
} as Meta;

export const Default: Story = (args) => ({
    props: args,
    template: `
<ngt-soba-center>
    <ngt-soba-text-3d
        font="soba/helvetiker_regular.typeface.json"
        [text]="text"
        [size]="size"
        [height]="height"
        [curveSegments]="curveSegments"
        [bevelEnabled]="bevelEnabled"
        [bevelThickness]="bevelThickness"
        [bevelSize]="bevelSize"
        [bevelOffset]="bevelOffset"
    >
        <ngt-mesh-normal-material></ngt-mesh-normal-material>
    </ngt-soba-text-3d> 
</ngt-soba-center>
`,
});

Default.args = {
    text: `@angular-three`,
    size: 3,
    height: 0.5,
    curveSegments: 2,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelOffset: 0,
};

Default.argTypes = {
    size: {
        control: createRangeControl(1, 10, 1),
    },
    height: {
        control: createRangeControl(0.1, 5, 0.1),
    },
    curveSegments: {
        control: createRangeControl(1, 5, 1),
    },
    bevelThickness: {
        control: createRangeControl(0.1, 4, 0.1),
    },
    bevelSize: {
        control: createRangeControl(0.1, 4, 0.1),
    },
    bevelOffset: {
        control: createRangeControl(0, 0.4, 0.1),
    },
};
