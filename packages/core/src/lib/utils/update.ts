import type { NgtAnyRecord, NgtCameraManual, NgtSize } from '../types';
import { is } from './is';

export function checkNeedsUpdate(value: unknown) {
    if (value !== null && is.obj(value) && 'needsUpdate' in (value as NgtAnyRecord)) {
        (value as NgtAnyRecord)['needsUpdate'] = true;

        if ('uniformsNeedUpdate' in (value as NgtAnyRecord)) {
            (value as NgtAnyRecord)['uniformsNeedUpdate'] = true;
        }
    }
}

export function checkUpdate(value: unknown) {
    if (is.object3D(value)) {
        value.updateMatrix();
    }

    if (is.camera(value)) {
        if (is.perspectiveCamera(value) || is.orthographicCamera(value)) {
            value.updateProjectionMatrix();
        }
        value.updateMatrixWorld();
    }

    checkNeedsUpdate(value);
}

export function updateCamera(camera: NgtCameraManual, size: NgtSize) {
    if (!camera.manual) {
        if (is.orthographicCamera(camera)) {
            camera.left = size.width / -2;
            camera.right = size.width / 2;
            camera.top = size.height / 2;
            camera.bottom = size.height / -2;
        } else {
            camera.aspect = size.width / size.height;
        }

        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();
    }
}
