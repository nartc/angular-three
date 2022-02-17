import { NgtIcosahedronGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaHtmlModule } from '@angular-three/soba/misc';
import {
    componentWrapperDecorator,
    Meta,
    moduleMetadata,
    Story,
} from '@storybook/angular';
import {
    setupCanvas,
    setupCanvasModules,
    turnAnimate,
} from '../../setup-canvas';

export default {
    title: 'Soba/Misc/HTML',
    decorators: [
        componentWrapperDecorator(
            setupCanvas({ cameraPosition: [-20, 20, -20] })
        ),
        moduleMetadata({
            imports: [
                ...setupCanvasModules,
                NgtSobaHtmlModule,
                NgtGroupModule,
                NgtMeshModule,
                NgtMeshBasicMaterialModule,
                NgtIcosahedronGeometryModule,
            ],
        }),
    ],
} as Meta;

export const Default: Story = (args) => ({
    props: { onAnimate: turnAnimate, ...args },
    template: `
        <ngt-group (animateReady)="onAnimate($event.object)">
            <ngt-icosahedron-geometry #ngtGeometry="ngtIcosahedronGeometry" [args]="[2, 2]"></ngt-icosahedron-geometry>
            <ngt-mesh-basic-material
                #ngtMaterial="ngtMeshBasicMaterial"
                [parameters]="{wireframe: true, color: 'hotpink'}"
            ></ngt-mesh-basic-material>
            <ngt-mesh
                [position]="[3, 6, 4]"
                [geometry]="ngtGeometry.geometry"
                [material]="ngtMaterial.material"
            >
                <ngt-soba-html [distanceFactor]="distanceFactor" [parentClass]="parentClass">First</ngt-soba-html>
            </ngt-mesh>
<!--            <ngt-mesh-->
<!--                [position]="[10, 0, 10]"-->
<!--                [geometry]="ngtGeometry.geometry"-->
<!--                [material]="ngtMaterial.material"-->
<!--            >-->
<!--                <ngt-soba-html [distanceFactor]="distanceFactor" [parentClass]="parentClass">Second</ngt-soba-html>-->
<!--            </ngt-mesh>-->
<!--            <ngt-mesh-->
<!--                [position]="[-20, 0, -20]"-->
<!--                [geometry]="ngtGeometry.geometry"-->
<!--                [material]="ngtMaterial.material"-->
<!--            >-->
<!--                <ngt-soba-html [distanceFactor]="distanceFactor" [parentClass]="parentClass">Third</ngt-soba-html>-->
<!--            </ngt-mesh>-->
        </ngt-group>
    `,
});

Default.args = {
    distanceFactor: 30,
    parentClass: 'html-story-block',
};
