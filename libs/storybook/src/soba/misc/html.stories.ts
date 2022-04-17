// import { NgtIcosahedronGeometryModule } from '@angular-three/core/geometries';
// import { NgtGroupModule } from '@angular-three/core/group';
// import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
// import { NgtMeshModule } from '@angular-three/core/meshes';
// import { NgtSobaHtmlModule } from '@angular-three/soba/misc';
// import {
//     componentWrapperDecorator,
//     Meta,
//     moduleMetadata,
//     Story,
// } from '@storybook/angular';
// import {
//     setupCanvas,
//     setupCanvasModules,
//     turnAnimate,
// } from '../../setup-canvas';
//
// export default {
//     title: 'Soba/Misc/HTML',
//     decorators: [
//         componentWrapperDecorator(
//             setupCanvas({ cameraPosition: [-20, 20, -20] })
//         ),
//         moduleMetadata({
//             imports: [
//                 ...setupCanvasModules,
//                 NgtSobaHtmlModule,
//                 NgtGroupModule,
//                 NgtMeshModule,
//                 NgtMeshBasicMaterialModule,
//                 NgtIcosahedronGeometryModule,
//             ],
//         }),
//     ],
// } as Meta;
//
// export const Default: Story = (args) => ({
//     props: { onAnimate: turnAnimate, ...args },
//     template: `
//         <ngt-group (animateReady)="onAnimate($event.object)">
//             <ngt-icosahedron-geometry #ngtGeometry="ngtIcosahedronGeometry" [args]="[2, 2]"></ngt-icosahedron-geometry>
//             <ngt-mesh-basic-material
//                 #ngtMaterial="ngtMeshBasicMaterial"
//                 [parameters]="{wireframe: true, color: 'hotpink'}"
//             ></ngt-mesh-basic-material>
//             <ngt-mesh
//                 [position]="[3, 6, 4]"
//                 [geometry]="ngtGeometry.geometry"
//                 [material]="ngtMaterial.material"
//             >
//                 <ngt-soba-html [distanceFactor]="distanceFactor" [parentClass]="parentClass">First</ngt-soba-html>
//             </ngt-mesh>
//             <ngt-mesh
//                 [position]="[10, 0, 10]"
//                 [geometry]="ngtGeometry.geometry"
//                 [material]="ngtMaterial.material"
//             >
//                 <ngt-soba-html [distanceFactor]="distanceFactor" [parentClass]="parentClass">Second</ngt-soba-html>
//             </ngt-mesh>
//             <ngt-mesh
//                 [position]="[-20, 0, -20]"
//                 [geometry]="ngtGeometry.geometry"
//                 [material]="ngtMaterial.material"
//             >
//                 <ngt-soba-html [distanceFactor]="distanceFactor" [parentClass]="parentClass">Third</ngt-soba-html>
//             </ngt-mesh>
//         </ngt-group>
//     `,
// });
//
// Default.args = {
//     distanceFactor: 30,
//     parentClass: 'html-story-block',
// };
//
// export const Transform: Story = (args) => ({
//     props: { onAnimate: turnAnimate, ...args },
//     template: `
//         <ngt-group (animateReady)="onAnimate($event.object)">
//             <ngt-icosahedron-geometry #ngtGeometry="ngtIcosahedronGeometry" [args]="[2, 2]"></ngt-icosahedron-geometry>
//             <ngt-mesh-basic-material
//                 #ngtMaterial="ngtMeshBasicMaterial"
//                 [parameters]="{wireframe: true, color: color }"
//             ></ngt-mesh-basic-material>
//             <ngt-mesh
//                 [position]="[3, 6, 4]"
//                 [geometry]="ngtGeometry.geometry"
//                 [material]="ngtMaterial.material"
//             >
//                 <ngt-soba-html [transform]="transform" [distanceFactor]="distanceFactor" [parentClass]="parentClass">First</ngt-soba-html>
//             </ngt-mesh>
//             <ngt-mesh
//                 [position]="[10, 0, 10]"
//                 [geometry]="ngtGeometry.geometry"
//                 [material]="ngtMaterial.material"
//             >
//                 <ngt-soba-html [transform]="transform" [distanceFactor]="distanceFactor" [parentClass]="parentClass">Second</ngt-soba-html>
//             </ngt-mesh>
//             <ngt-mesh
//                 [position]="[-20, 0, -20]"
//                 [geometry]="ngtGeometry.geometry"
//                 [material]="ngtMaterial.material"
//             >
//                 <ngt-soba-html [transform]="transform" [distanceFactor]="distanceFactor" [parentClass]="parentClass">Third</ngt-soba-html>
//             </ngt-mesh>
//             <ngt-soba-html
//                 [sprite]="true"
//                 [transform]="transform"
//                 [distanceFactor]="20"
//                 [parentStyle]="{background: color, fontSize: '50px', padding: '10px 18px', border: '2px solid black'}"
//                 [position]="[5, 15, 0]"
//             >
//                 Transform Mode
//             </ngt-soba-html>
//         </ngt-group>
//     `,
// });
//
// Transform.args = {
//     color: 'palegreen',
//     transform: true,
//     parentClass: 'html-story-block margin300',
//     distanceFactor: 30,
// };
