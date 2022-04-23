import * as THREE from 'three';
import type { NgtCamera, NgtCameraOptions, NgtSize, NgtState } from '../types';
import { is } from './is';

export function updateCamera(
    cameraOptions: NgtCameraOptions,
    camera: NgtCamera & { manual?: boolean },
    size: NgtSize
) {
    // leave the userland camera alone
    if (!(is.camera(cameraOptions) || camera.manual)) {
        if (is.orthographic(camera)) {
            camera.left = size.width / -2;
            camera.right = size.width / 2;
            camera.top = size.height / 2;
            camera.bottom = size.height / -2;
        } else {
            camera.aspect = size.width / size.height;
        }

        camera.updateProjectionMatrix();
        // https://github.com/pmndrs/react-three-fiber/issues/178
        // Update matrix world since the renderer is a frame late
        camera.updateMatrixWorld();
    }
}

export function createDefaultCamera(state: NgtState) {
    if (state.orthographic) {
        return new THREE.OrthographicCamera(0, 0, 0, 0, 0.1, 1000);
    }

    return new THREE.PerspectiveCamera(
        75,
        state.size.width / state.size.height,
        0.1,
        1000
    );
}
