// import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
// import { NgtMeshNormalMaterialModule } from '@angular-three/core/materials';
// import { NgtMeshModule } from '@angular-three/core/meshes';
// import { NgtPrimitiveModule } from '@angular-three/core/primitive';
// import { NgtGLTFLoader } from '@angular-three/soba/loaders';
// import { NgtSobaCenterModule } from '@angular-three/soba/staging';
// import { CommonModule } from '@angular/common';
// import {
//     ChangeDetectionStrategy,
//     Component,
//     Input,
//     NgModule,
// } from '@angular/core';
// import {
//     componentWrapperDecorator,
//     Meta,
//     moduleMetadata,
//     Story,
// } from '@storybook/angular';
// import * as THREE from 'three';
// import { setupCanvas, setupCanvasModules } from '../../setup-canvas';
//
// @Component({
//     selector: 'ngt-default-center',
//     template: `
//         <ng-container *ngIf="node$ | async as node">
//             <ngt-soba-center [position]="[5, 5, 10]" [alignTop]="alignTop">
//                 <ngt-mesh>
//                     <ngt-box-geometry [args]="[10, 10, 10]"></ngt-box-geometry>
//                     <ngt-mesh-normal-material
//                         [parameters]="{ wireframe: true }"
//                     ></ngt-mesh-normal-material>
//                 </ngt-mesh>
//                 <ngt-primitive
//                     [object]="node.scene"
//                     [scale]="[0.01, 0.01, 0.01]"
//                     (animateReady)="onTokyoAnimated(node.scene)"
//                 ></ngt-primitive>
//             </ngt-soba-center>
//         </ng-container>
//     `,
//     changeDetection: ChangeDetectionStrategy.OnPush,
// })
// class DefaultCenter {
//     @Input() alignTop = false;
//
//     node$ = this.gltfLoader.load('/assets/LittlestTokyo.glb');
//
//     constructor(private gltfLoader: NgtGLTFLoader) {}
//
//     onTokyoAnimated(scene: THREE.Group) {
//         scene.rotation.y += 0.01;
//     }
// }
//
// @NgModule({
//     declarations: [DefaultCenter],
//     exports: [DefaultCenter],
//     imports: [
//         CommonModule,
//         NgtSobaCenterModule,
//         NgtMeshModule,
//         NgtMeshNormalMaterialModule,
//         NgtPrimitiveModule,
//         NgtBoxGeometryModule,
//         NgtSobaCenterModule,
//     ],
// })
// class DefaultCenterModule {}
//
// export default {
//     title: 'Soba/Staging/Center',
//     decorators: [
//         componentWrapperDecorator(
//             setupCanvas({ cameraPosition: [0, 0, -10], loader: true })
//         ),
//         moduleMetadata({
//             imports: [...setupCanvasModules, DefaultCenterModule],
//         }),
//     ],
// } as Meta;
//
// export const Default: Story = (args) => ({
//     props: args,
//     template: `
//       <ngt-default-center [alignTop]="alignTop"></ngt-default-center>
//     `,
// });
//
// Default.args = {
//     alignTop: false,
// };
