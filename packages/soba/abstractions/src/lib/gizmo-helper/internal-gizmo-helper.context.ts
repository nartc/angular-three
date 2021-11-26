import {
  CanvasStore,
  distinctKeyMap,
  EnhancedComponentStore,
  LoopService,
} from '@angular-three/core';
import { Injectable, NgZone } from '@angular/core';
import { noop, Observable, tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';
import { gizmoHelperConstants } from './constants';

export interface SobaGizmoHelperContextState {
  alignment: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
  margin: [number, number];
  onTarget?: () => THREE.Vector3;
  raycast: (
    this: THREE.Object3D,
    raycaster: THREE.Raycaster,
    intersects: THREE.Intersection[]
  ) => void;
}

export const initialSobaGizmoHelperContextState: SobaGizmoHelperContextState = {
  alignment: 'bottom-right',
  margin: [80, 80],
  onTarget: undefined,
  raycast: noop,
};

export type ControlsProto = { update(): void; target: THREE.Vector3 };

@Injectable()
export class InternalSobaGizmoHelperContext extends EnhancedComponentStore<SobaGizmoHelperContextState> {
  animating = false;
  radius = 0;
  focusPoint = new THREE.Vector3(0, 0, 0);

  readonly dimension$ = this.select(
    this.selectors.alignment$,
    this.selectors.margin$,
    this.canvasStore.selectors.internal$.pipe(distinctKeyMap('size')),
    (alignment, [marginX, marginY], size) => ({
      x: alignment.endsWith('-left')
        ? -size.width / 2 + marginX
        : size.width / 2 - marginX,
      y: alignment.startsWith('top-')
        ? size.height / 2 - marginY
        : -size.height / 2 + marginY,
    }),
    { debounce: true }
  );

  constructor(
    private canvasStore: CanvasStore,
    private loopService: LoopService,
    private ngZone: NgZone
  ) {
    super(initialSobaGizmoHelperContextState);
  }

  readonly initRaycastEffect = this.effect<THREE.OrthographicCamera>(
    (camera$) =>
      camera$.pipe(
        withLatestFrom(this.canvasStore.selectors.mouse$),
        tap(([camera, mouse]) => {
          this.ngZone.runOutsideAngular(() => {
            const raycaster = new THREE.Raycaster();
            this.patchState({
              raycast: function (this: THREE.Object3D, _, intersects) {
                raycaster.setFromCamera(mouse, camera);
                const rc = this.constructor.prototype.raycast.bind(this);
                if (rc) rc(raycaster, intersects);
              },
            });
          });
        })
      )
  );

  readonly tweenCamera = this.effect<THREE.Vector3>((direction$) => {
    return direction$.pipe(
      withLatestFrom(
        this.canvasStore.selectors.camera$,
        this.canvasStore.selectors
          .controls$ as unknown as Observable<ControlsProto>,
        this.selectors.onTarget$
      ),
      tap(([direction, mainCamera, defaultControls, onTarget]) => {
        this.ngZone.runOutsideAngular(() => {
          this.animating = true;
          if (defaultControls || onTarget) {
            this.focusPoint = defaultControls?.target || onTarget?.();
          }
          this.radius = mainCamera!.position.distanceTo(
            gizmoHelperConstants.target
          );

          // Rotate from current camera orientation
          gizmoHelperConstants.q1.copy(mainCamera!.quaternion);

          // To new current camera orientation
          gizmoHelperConstants.targetPosition
            .copy(direction)
            .multiplyScalar(this.radius)
            .add(gizmoHelperConstants.target);
          gizmoHelperConstants.dummy.lookAt(
            gizmoHelperConstants.targetPosition
          );
          gizmoHelperConstants.q2.copy(gizmoHelperConstants.dummy.quaternion);

          this.loopService.start();
        });
      })
    );
  });
}
