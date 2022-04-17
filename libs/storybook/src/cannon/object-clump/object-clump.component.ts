// import {
//     GetByIndex,
//     NgtPhysicsModule,
//     SphereProps,
// } from '@angular-three/cannon';
// import {
//     NgtPhysicSphere,
//     NgtPhysicSphereModule,
// } from '@angular-three/cannon/bodies';
// import { NgtCannonDebugModule } from '@angular-three/cannon/debug';
// import {
//     NgtAnimationFrameStore,
//     NgtCoreModule,
//     NgtStore,
//     NgtTriplet,
//     NgtVector3,
//     NgtVectorPipeModule,
//     tapEffect,
// } from '@angular-three/core';
// import { NgtSphereGeometryModule } from '@angular-three/core/geometries';
// import {
//     NgtAmbientLightModule,
//     NgtDirectionalLightModule,
//     NgtSpotLightModule,
// } from '@angular-three/core/lights';
// import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
// import { NgtInstancedMeshModule } from '@angular-three/core/meshes';
// import { NgtPrimitiveModule } from '@angular-three/core/primitive';
// import { NgtEffectComposerModule } from '@angular-three/postprocessing';
// import { NgtSSAOModule } from '@angular-three/postprocessing/effects';
// import {
//     NgtSobaEnvironmentModule,
//     NgtSobaSkyModule,
// } from '@angular-three/soba/staging';
// import {
//     ChangeDetectionStrategy,
//     Component,
//     NgModule,
//     OnInit,
//     ViewChild,
// } from '@angular/core';
// import * as THREE from 'three';
//
// @Component({
//     selector: 'storybook-object-clump',
//     template: `
//         <ngt-canvas
//             [shadows]="true"
//             [dpr]="[1, 2]"
//             [camera]="{ position: [0, 0, 20], fov: 35, near: 1, far: 40 }"
//         >
//             <ngt-ambient-light [intensity]="0.25"></ngt-ambient-light>
//             <ngt-spot-light
//                 [args]="[undefined, 1, undefined, 0.2, 1]"
//                 [position]="[30, 30, 30]"
//                 [castShadow]="true"
//                 [shadow]="{ mapSize: [512, 512] | vector2 }"
//             ></ngt-spot-light>
//             <ngt-directional-light
//                 [intensity]="5"
//                 [position]="[-10, -10, -10]"
//                 color="purple"
//             ></ngt-directional-light>
//
//             <ngt-physics [gravity]="[0, 2, 0]" [iterations]="10">
//                 <storybook-pointer></storybook-pointer>
//                 <storybook-clump></storybook-clump>
//             </ngt-physics>
//             <ngt-soba-sky></ngt-soba-sky>
//             <ngt-soba-environment preset="sunset"></ngt-soba-environment>
//             <ngt-effect-composer>
//                 <ngt-ssao></ngt-ssao>
//             </ngt-effect-composer>
//         </ngt-canvas>
//     `,
//     changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class ObjectClumpComponent {}
//
// @Component({
//     selector: 'storybook-pointer',
//     template: `
//         <ng-container
//             ngtPhysicSphere
//             [getPhysicProps]="getSphereProps"
//         ></ng-container>
//     `,
//     changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class PointerComponent extends NgtStore implements OnInit {
//     getSphereProps: GetByIndex<SphereProps> = () => ({
//         position: [0, 0, 0],
//         type: 'Kinematic',
//         args: [3],
//     });
//
//     @ViewChild(NgtPhysicSphere, { static: true })
//     physicSphere!: NgtPhysicSphere;
//
//     constructor(private animationFrameStore: NgtAnimationFrameStore) {
//         super();
//     }
//
//     ngOnInit() {
//         this.effect<void>(
//             tapEffect(() => {
//                 const uuid = this.animationFrameStore.register({
//                     callback: ({ viewport, mouse }) => {
//                         this.physicSphere.api.position.set(
//                             (mouse.x * viewport.width) / 2,
//                             (mouse.y * viewport.height) / 2,
//                             0
//                         );
//                     },
//                 });
//
//                 return () => {
//                     this.animationFrameStore.unregister(uuid);
//                 };
//             })
//         )();
//     }
// }
//
// const mat = new THREE.Matrix4();
// const vec = new THREE.Vector3();
//
// @Component({
//     selector: 'storybook-clump',
//     template: `
//         <ngt-instanced-mesh
//             ngtPhysicSphere
//             #physicSphere="ngtPhysicSphere"
//             [getPhysicProps]="getSphereProps"
//             [castShadow]="true"
//             [receiveShadow]="true"
//             [args]="[count]"
//             (animateReady)="onAnimate($event.object, physicSphere)"
//         >
//             <ngt-sphere-geometry [args]="[1, 32, 32]"></ngt-sphere-geometry>
//             <ngt-mesh-standard-material
//                 [parameters]="{
//                     color: 'red',
//                     roughness: 0,
//                     envMapIntensity: 0.2,
//                     emissive: '#370037'
//                 }"
//             ></ngt-mesh-standard-material>
//         </ngt-instanced-mesh>
//     `,
//     changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class ClumpComponent {
//     get position() {
//         return [
//             THREE.MathUtils.randFloatSpread(20),
//             THREE.MathUtils.randFloatSpread(20),
//             THREE.MathUtils.randFloatSpread(20),
//         ] as NgtVector3;
//     }
//
//     count = 40;
//
//     getSphereProps: GetByIndex<SphereProps> = () => ({
//         args: [1],
//         mass: 1,
//         angularDamping: 0.1,
//         linearDamping: 0.65,
//         position: this.position as NgtTriplet,
//     });
//
//     onAnimate(object: THREE.Object3D, physicSphere: NgtPhysicSphere) {
//         for (let i = 0; i < this.count; i++) {
//             // Get current whereabouts of the instanced sphere
//             (object as THREE.InstancedMesh).getMatrixAt(i, mat);
//             // Normalize the position and multiply by a negative force.
//             // This is enough to drive it towards the center-point.
//             physicSphere.api
//                 .at(i)
//                 .applyForce(
//                     vec
//                         .setFromMatrixPosition(mat)
//                         .normalize()
//                         .multiplyScalar(-50)
//                         .toArray(),
//                     [0, 0, 0]
//                 );
//         }
//     }
// }
//
// @NgModule({
//     declarations: [ObjectClumpComponent, PointerComponent, ClumpComponent],
//     exports: [ObjectClumpComponent],
//     imports: [
//         NgtPhysicSphereModule,
//         NgtInstancedMeshModule,
//         NgtSphereGeometryModule,
//         NgtCoreModule,
//         NgtAmbientLightModule,
//         NgtSpotLightModule,
//         NgtVectorPipeModule,
//         NgtDirectionalLightModule,
//         NgtPhysicsModule,
//         NgtSobaEnvironmentModule,
//         NgtEffectComposerModule,
//         NgtSSAOModule,
//         NgtMeshStandardMaterialModule,
//         NgtPrimitiveModule,
//         NgtCannonDebugModule,
//         NgtSobaSkyModule,
//     ],
// })
// export class ObjectClumpComponentModule {}
