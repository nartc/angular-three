// import { NgtRadianPipeModule } from '@angular-three/core';
// import { NgtPlaneGeometryModule } from '@angular-three/core/geometries';
// import { NgtAxesHelperModule } from '@angular-three/core/helpers';
// import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
// import { NgtMeshModule } from '@angular-three/core/meshes';
// import { NgtSobaSkyModule } from '@angular-three/soba/staging';
// import {
//     componentWrapperDecorator,
//     Meta,
//     moduleMetadata,
//     Story,
// } from '@storybook/angular';
// import { setupCanvas, setupCanvasModules } from '../../setup-canvas';
//
// export default {
//     title: 'Soba/Staging/Sky',
//     decorators: [
//         componentWrapperDecorator(setupCanvas()),
//         moduleMetadata({
//             imports: [
//                 ...setupCanvasModules,
//                 NgtSobaSkyModule,
//                 NgtAxesHelperModule,
//                 NgtMeshModule,
//                 NgtPlaneGeometryModule,
//                 NgtMeshBasicMaterialModule,
//                 NgtRadianPipeModule,
//             ],
//         }),
//     ],
// } as Meta;
//
// export const Default: Story = () => ({
//     template: `
//         <ngt-soba-sky></ngt-soba-sky>
//         <ngt-mesh [rotation]="[90 | radian, 0, 0]">
//             <ngt-plane-geometry [args]="[100, 100, 4, 4]"></ngt-plane-geometry>
//             <ngt-mesh-basic-material [parameters]="{color: 'black', wireframe: true}"></ngt-mesh-basic-material>
//         </ngt-mesh>
//         <ngt-axes-helper></ngt-axes-helper>
//     `,
// });
