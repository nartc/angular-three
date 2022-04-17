// import { NgtTorusKnotGeometryModule } from '@angular-three/core/geometries';
// import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
// import { NgtMeshModule } from '@angular-three/core/meshes';
// import {
//     NgtSobaEnvironmentModule,
//     presetsObj,
// } from '@angular-three/soba/staging';
// import {
//     componentWrapperDecorator,
//     Meta,
//     moduleMetadata,
//     Story,
// } from '@storybook/angular';
// import { setupCanvas, setupCanvasModules } from '../../setup-canvas';
//
// export default {
//     title: 'Soba/Staging/Environment',
//     decorators: [
//         componentWrapperDecorator(
//             setupCanvas({ controls: false, cameraPosition: [0, 0, 10] })
//         ),
//         moduleMetadata({
//             imports: [
//                 ...setupCanvasModules,
//                 NgtSobaEnvironmentModule,
//                 NgtMeshModule,
//                 NgtTorusKnotGeometryModule,
//                 NgtMeshStandardMaterialModule,
//             ],
//         }),
//     ],
//     argTypes: {
//         preset: {
//             options: Object.keys(presetsObj),
//             control: { type: 'select' },
//         },
//         background: {
//             control: { type: 'boolean' },
//         },
//     },
// } as Meta;
//
// export const Default: Story = (args) => {
//     return {
//         props: args,
//         template: `
//       <ngt-mesh>
//         <ngt-torus-knot-geometry [args]='[1, 0.5, 128, 32]'></ngt-torus-knot-geometry>
//         <ngt-mesh-standard-material [parameters]='{metalness: 1, roughness: 0}'></ngt-mesh-standard-material>
//       </ngt-mesh>
//       <ngt-soba-environment [preset]='preset' [background]='background'></ngt-soba-environment>
//       <ngt-soba-orbit-controls (ready)='$event.autoRotate = true;'></ngt-soba-orbit-controls>
//   `,
//     };
// };
//
// Default.args = {
//     preset: 'sunset',
//     background: true,
// };
