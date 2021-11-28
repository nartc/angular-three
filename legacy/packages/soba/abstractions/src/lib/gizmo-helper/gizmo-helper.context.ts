import { EnhancedComponentStore } from '@angular-three/core';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { InternalSobaGizmoHelperContext } from './internal-gizmo-helper.context';

@Injectable()
export class SobaGizmoHelperContext extends EnhancedComponentStore {
  constructor(
    private internalSobaGizmoHelperContext: InternalSobaGizmoHelperContext
  ) {
    super({});
  }

  get raycast(): (
    raycaster: THREE.Raycaster,
    intersects: THREE.Intersection[]
  ) => void {
    return this.internalSobaGizmoHelperContext.getImperativeState().raycast;
  }

  readonly tweenCamera = this.internalSobaGizmoHelperContext.tweenCamera;
}
