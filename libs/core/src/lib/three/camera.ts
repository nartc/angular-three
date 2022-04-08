import { Directive } from '@angular/core';
import * as THREE from 'three';
import { NgtObject, NgtObjectState } from '../abstracts/object';
import type { AnyConstructor } from '../types';
import { isOrthographicCamera } from '../utils/is-orthographic';
import { isPerspectiveCamera } from '../utils/is-perspective';

export interface NgtCommonCameraState<
    TCamera extends THREE.Camera = THREE.Camera
> extends NgtObjectState<TCamera> {
    cameraArgs: unknown[];
}

@Directive()
export abstract class NgtCommonCamera<
    TCamera extends THREE.Camera = THREE.Camera
> extends NgtObject<TCamera, NgtCommonCameraState<TCamera>> {
    abstract get cameraType(): AnyConstructor<TCamera>;

    protected set cameraArgs(v: unknown | unknown[]) {
        this.set({ cameraArgs: Array.isArray(v) ? v : [v] });
    }

    protected override objectInitFn(): TCamera {
        const cameraArgs = this.get((s) => s.cameraArgs);
        return new this.cameraType(...cameraArgs);
    }

    protected override postApplyCustomProps() {
        if (
            isPerspectiveCamera(this.object3d) ||
            isOrthographicCamera(this.object3d)
        ) {
            this.object3d.updateProjectionMatrix();
        }
        this.object3d.updateMatrixWorld();
    }

    override ngOnInit() {
        this.init();
        super.ngOnInit();
    }
}
