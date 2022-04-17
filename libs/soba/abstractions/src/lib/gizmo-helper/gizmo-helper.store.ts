import { Injectable } from '@angular/core';

@Injectable()
export class NgtSobaGizmoHelperStore {}

// import {
//     NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
//     NgtAnimationFrameStore,
//     NgtCanvasStore,
//     NgtLoop,
//     NgtObjectInputsController,
//     NgtStore,
//     tapEffect,
// } from '@angular-three/core';
// import { Inject, Injectable, NgZone, Self } from '@angular/core';
// import { Observable, tap } from 'rxjs';
// import * as THREE from 'three';
//
// const turnRate = 2 * Math.PI; // turn rate in angles per second
// const dummy = new THREE.Object3D();
// const matrix = new THREE.Matrix4();
// const [q1, q2] = [new THREE.Quaternion(), new THREE.Quaternion()];
// const target = new THREE.Vector3();
// const targetPosition = new THREE.Vector3();
//
// type ControlsProto = { update(): void; target: THREE.Vector3 };
//
// export interface NgtSobaGizmoHelperState {
//     alignment: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
//     margin: [number, number];
//     renderPriority: number;
//     virtualScene: THREE.Scene;
//     virtualCamera: THREE.Camera;
//     gizmo: THREE.Group;
//     raycast: THREE.Object3D['raycast'];
//     objectInputsController: NgtObjectInputsController;
// }
//
// @Injectable()
// export class NgtSobaGizmoHelperStore extends NgtStore<NgtSobaGizmoHelperState> {
//     private animating = false;
//     private focusPoint = new THREE.Vector3();
//     private radius = 0;
//
//     readonly virtualScene$ = this.select((s) => s.virtualScene);
//     readonly gizmoProps$: Observable<
//         Pick<NgtSobaGizmoHelperState, 'objectInputsController'> & {
//             x: number;
//             y: number;
//         }
//     > = this.select(
//         this.select((s) => s.margin),
//         this.select((s) => s.alignment),
//         this.select((s) => s.objectInputsController),
//         this.canvasStore.select((s) => s.size),
//         ([marginX, marginY], alignment, objectInputsController, size) => {
//             const x = alignment.endsWith('-left')
//                 ? -size.width / 2 + marginX
//                 : size.width / 2 - marginX;
//             const y = alignment.startsWith('top-')
//                 ? size.height / 2 - marginY
//                 : -size.height / 2 + marginY;
//
//             objectInputsController.position = [x, y, 0];
//             return {
//                 objectInputsController,
//                 x,
//                 y,
//             };
//         }
//     );
//
//     constructor(
//         @Self()
//         @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
//         objectInputsController: NgtObjectInputsController,
//         private animationFrameStore: NgtAnimationFrameStore,
//         private zone: NgZone,
//         private canvasStore: NgtCanvasStore,
//         private loop: NgtLoop
//     ) {
//         super();
//
//         const virtualScene = new THREE.Scene();
//         objectInputsController.appendTo = virtualScene;
//
//         this.set({
//             alignment: 'bottom-right',
//             margin: [80, 80],
//             renderPriority: 0,
//             virtualScene,
//             objectInputsController,
//         });
//     }
//
//     private readonly switchBackground = this.effect<void>(
//         tapEffect(() => {
//             let mainSceneBackground: THREE.Scene['background'];
//             const scene = this.canvasStore.get((s) => s.scene);
//             const virtualScene = this.get((s) => s.virtualScene);
//
//             if (scene.background) {
//                 mainSceneBackground = scene.background;
//                 scene.background = null;
//                 virtualScene.background = mainSceneBackground;
//             }
//
//             return () => {
//                 if (mainSceneBackground) {
//                     scene.background = mainSceneBackground;
//                 }
//             };
//         })
//     );
//
//     private readonly registerAnimation = this.effect<void>(
//         tapEffect(() => {
//             const priority = this.get((s) => s.renderPriority);
//             const renderer = this.canvasStore.get((s) => s.renderer);
//
//             const animationUuid = this.animationFrameStore.register({
//                 callback: ({ delta }) => {
//                     const { virtualScene, virtualCamera, gizmo } = this.get();
//                     if (virtualCamera && gizmo) {
//                         this.animateStep(delta);
//                         this.beforeRender();
//                         renderer.autoClear = false;
//                         renderer.clearDepth();
//                         renderer.render(virtualScene, virtualCamera);
//                     }
//                 },
//                 priority,
//             });
//
//             return () => {
//                 this.animationFrameStore.unregister(animationUuid);
//             };
//         })
//     );
//
//     private readonly setRaycast = this.effect<THREE.Camera>(
//         tap((virtualCamera) => {
//             const mouse = this.canvasStore.get((s) => s.mouse);
//             const raycaster = new THREE.Raycaster();
//
//             this.set({
//                 raycast: function (this: THREE.Object3D, _, intersects) {
//                     raycaster.setFromCamera(mouse, virtualCamera);
//                     const rc = this.constructor.prototype.raycast.bind(this);
//                     if (rc) {
//                         rc(raycaster, intersects);
//                     }
//                 },
//             });
//         })
//     );
//
//     init() {
//         this.zone.runOutsideAngular(() => {
//             this.onCanvasReady(this.canvasStore.ready$, () => {
//                 this.switchBackground();
//                 this.registerAnimation();
//                 this.setRaycast(this.select((s) => s.virtualCamera));
//             });
//         });
//     }
//
//     tweenCamera(direction: THREE.Vector3) {
//         const { controls: defaultControls, camera: mainCamera } =
//             this.canvasStore.get();
//         this.animating = true;
//
//         if (defaultControls) {
//             this.focusPoint = (
//                 defaultControls as unknown as ControlsProto
//             ).target;
//         }
//         this.radius = mainCamera.position.distanceTo(target);
//
//         // Rotate from current camera orientation
//         q1.copy(mainCamera.quaternion);
//
//         // To new current camera orientation
//         targetPosition.copy(direction).multiplyScalar(this.radius).add(target);
//         dummy.lookAt(targetPosition);
//         q2.copy(dummy.quaternion);
//
//         this.loop.invalidate();
//     }
//
//     private animateStep(delta: number) {
//         if (!this.animating) return;
//
//         if (q1.angleTo(q2) < 0.01) {
//             this.animating = false;
//             return;
//         }
//
//         const { controls: defaultControls, camera: mainCamera } =
//             this.canvasStore.get();
//         const step = delta * turnRate;
//
//         // animate position by doing a lerp and then scaling the position on the unit sphere
//         q1.rotateTowards(q2, step);
//
//         // animate orientation
//         mainCamera.position
//             .set(0, 0, 1)
//             .applyQuaternion(q1)
//             .multiplyScalar(this.radius)
//             .add(this.focusPoint);
//         mainCamera.up.set(0, 1, 0).applyQuaternion(q1).normalize();
//         mainCamera.quaternion.copy(q1);
//
//         if (defaultControls) {
//             (defaultControls as unknown as ControlsProto).update();
//         }
//
//         this.loop.invalidate();
//     }
//
//     private beforeRender() {
//         const mainCamera = this.canvasStore.get((s) => s.camera);
//         const gizmo = this.get((s) => s.gizmo);
//
//         // sync gizmo with main camera orientation
//         matrix.copy(mainCamera.matrix).invert();
//         gizmo?.quaternion.setFromRotationMatrix(matrix);
//     }
// }
