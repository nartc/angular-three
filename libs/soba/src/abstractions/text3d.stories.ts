import { NgtSobaText3dModule } from '@angular-three/soba/abstractions';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { NgtMeshStandardMaterialModule } from '../../../core/materials/src';
import { createRangeControl } from '../create-control';
import { setupCanvas, setupCanvasModules } from '../setup-canvas';

export default {
    title: 'Abstractions/Text3d',
    decorators: [
        componentWrapperDecorator(setupCanvas({ cameraPosition: [0, 0, 10] })),
        moduleMetadata({
            imports: [...setupCanvasModules, NgtSobaText3dModule, NgtMeshStandardMaterialModule],
        }),
    ],
} as Meta;

export const Default: Story = (args) => ({
    props: args,
    template: `
    <ngt-mesh-standard-material #mat1 [parameters]="{ color:'#b00000' | color }"></ngt-mesh-standard-material>
    <ngt-mesh-standard-material #mat2 [parameters]="{ color:'#ff8000' | color }"></ngt-mesh-standard-material>

    <ngt-soba-text3d [text]="text" [size]="size" [height]="height" [curveSegments]="curveSegments" [center]="center"
       [bevelEnabled]="bevelEnabled" [bevelThickness]="bevelThickness" [bevelSize]="bevelSize" [bevelOffset]="bevelOffset"
       [fonturl]="'soba/helvetiker_regular.typeface.json'"
       [material]="[mat2.instance.value, mat1.instance.value]"></ngt-soba-text3d>
`,
});

Default.args = {
    text: `@angular-three`,
    size: 3,
    height: 0.5,
    curveSegments: 2,
    bevelEnabled: false,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelOffset: 0,
    center: true,
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
