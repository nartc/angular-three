import {
  EnhancedRxState,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtAnimationFrameStore,
  NgtLoopService,
  NgtObject3dInputsController,
  NgtStore,
} from '@angular-three/core';
import { Inject, Injectable, NgZone } from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, filter, map } from 'rxjs';
import * as THREE from 'three';

const turnRate = 2 * Math.PI; // turn rate in angles per second
const dummy = new THREE.Object3D();
const matrix = new THREE.Matrix4();
const [q1, q2] = [new THREE.Quaternion(), new THREE.Quaternion()];
const target = new THREE.Vector3();
const targetPosition = new THREE.Vector3();

type ControlsProto = { update(): void; target: THREE.Vector3 };

export interface NgtSobaGizmoHelperState {
  alignment: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
  margin: [number, number];
  renderPriority: number;
  virtualScene: THREE.Scene;
  virtualCamera: THREE.Camera;
  gizmo: THREE.Group;
  raycast: THREE.Object3D['raycast'];
  objectInputsController: NgtObject3dInputsController;
}

@Injectable()
export class NgtSobaGizmoHelperStore extends EnhancedRxState<
  NgtSobaGizmoHelperState,
  { init: void }
> {
  #animating = false;
  #focusPoint = new THREE.Vector3();
  #radius = 0;

  actions = this.create();

  readonly gizmoProps$ = combineLatest([
    this.select(selectSlice(['margin', 'alignment', 'objectInputsController'])),
    this.store.select('size'),
  ]).pipe(
    map(
      ([
        {
          alignment,
          margin: [marginX, marginY],
          objectInputsController,
        },
        size,
      ]) => {
        const x = alignment.endsWith('-left')
          ? -size.width / 2 + marginX
          : size.width / 2 - marginX;
        const y = alignment.startsWith('top-')
          ? size.height / 2 - marginY
          : -size.height / 2 + marginY;

        objectInputsController.position = [x, y, 0];
        return {
          objectInputsController,
          x,
          y,
        };
      }
    )
  );

  #ready$ = combineLatest([
    this.actions.init$,
    this.store.select('ready').pipe(filter((ready) => ready)),
  ]);

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    objectInputsController: NgtObject3dInputsController,
    animationFrameStore: NgtAnimationFrameStore,
    ngZone: NgZone,
    private store: NgtStore,
    private loopService: NgtLoopService
  ) {
    super();

    const virtualScene = new THREE.Scene();
    objectInputsController.appendTo = virtualScene;

    this.set({
      alignment: 'bottom-right',
      margin: [80, 80],
      renderPriority: 0,
      virtualScene,
      objectInputsController,
    });

    this.holdEffect(this.#ready$, () => {
      return ngZone.runOutsideAngular(() => {
        let mainSceneBackground: THREE.Scene['background'];
        const scene = this.store.get('scene');
        const virtualScene = this.get('virtualScene');

        if (scene.background) {
          mainSceneBackground = scene.background;
          scene.background = null;
          virtualScene.background = mainSceneBackground;
        }

        return () => {
          if (mainSceneBackground) {
            scene.background = mainSceneBackground;
          }
        };
      });
    });

    this.holdEffect(this.#ready$, () => {
      return ngZone.runOutsideAngular(() => {
        const priority = this.get('renderPriority');
        const renderer = this.store.get('renderer');

        const animationUuid = animationFrameStore.register({
          callback: ({ delta }) => {
            const { virtualScene, virtualCamera, gizmo } = this.get();
            if (virtualCamera && gizmo) {
              this.#animateStep(delta);
              this.#beforeRender();
              renderer.autoClear = false;
              renderer.clearDepth();
              renderer.render(virtualScene, virtualCamera);
            }
          },
          priority,
        });

        return () => {
          animationFrameStore.actions.unsubscriberUuid(animationUuid);
        };
      });
    });

    this.connect(
      'raycast',
      this.select('virtualCamera'),
      (_, virtualCamera) => {
        const mouse = this.store.get('mouse');
        const raycaster = new THREE.Raycaster();

        return function (this: THREE.Object3D, _, intersects) {
          raycaster.setFromCamera(mouse, virtualCamera);
          const rc = this.constructor.prototype.raycast.bind(this);
          if (rc) {
            rc(raycaster, intersects);
          }
        };
      }
    );
  }

  tweenCamera(direction: THREE.Vector3) {
    const { controls: defaultControls, camera: mainCamera } = this.store.get();
    this.#animating = true;

    if (defaultControls) {
      this.#focusPoint = (defaultControls as unknown as ControlsProto).target;
    }
    this.#radius = mainCamera.position.distanceTo(target);

    // Rotate from current camera orientation
    q1.copy(mainCamera.quaternion);

    // To new current camera orientation
    targetPosition.copy(direction).multiplyScalar(this.#radius).add(target);
    dummy.lookAt(targetPosition);
    q2.copy(dummy.quaternion);

    this.loopService.invalidate();
  }

  #animateStep(delta: number) {
    if (!this.#animating) return;

    if (q1.angleTo(q2) < 0.01) {
      this.#animating = false;
      return;
    }

    const { controls: defaultControls, camera: mainCamera } = this.store.get();
    const step = delta * turnRate;

    // animate position by doing a lerp and then scaling the position on the unit sphere
    q1.rotateTowards(q2, step);

    // animate orientation
    mainCamera.position
      .set(0, 0, 1)
      .applyQuaternion(q1)
      .multiplyScalar(this.#radius)
      .add(this.#focusPoint);
    mainCamera.up.set(0, 1, 0).applyQuaternion(q1).normalize();
    mainCamera.quaternion.copy(q1);

    if (defaultControls) {
      (defaultControls as unknown as ControlsProto).update();
    }

    this.loopService.invalidate();
  }

  #beforeRender() {
    const mainCamera = this.store.get('camera');
    const gizmo = this.get('gizmo');

    // sync gizmo with main camera orientation
    matrix.copy(mainCamera.matrix).invert();
    gizmo?.quaternion.setFromRotationMatrix(matrix);
  }
}
