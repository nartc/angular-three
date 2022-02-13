import { InjectionToken } from '@angular/core';
import * as THREE from 'three';

export const NGT_OBJECT_TYPE = new InjectionToken('Object Type', {
    providedIn: 'root',
    factory: () => THREE.Object3D,
});
export const NGT_OBJECT_POST_INIT = new InjectionToken('Object PostInit', {
    providedIn: 'root',
    factory: () => undefined,
});
