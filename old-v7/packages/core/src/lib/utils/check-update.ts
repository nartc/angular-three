import type { NgtUnknownRecord } from '../types';
import { is } from './is';

export function checkNeedsUpdate(value: unknown) {
  if (value !== null && is.obj(value) && 'needsUpdate' in (value as NgtUnknownRecord)) {
    (value as NgtUnknownRecord)['needsUpdate'] = true;

    if ('uniformsNeedUpdate' in (value as NgtUnknownRecord)) {
      (value as NgtUnknownRecord)['uniformsNeedUpdate'] = true;
    }
  }
}

export function checkUpdate(value: unknown) {
  if (is.object3d(value)) {
    value.updateMatrix();
  } else if (is.camera(value)) {
    if (is.perspective(value) || is.orthographic(value)) {
      value.updateProjectionMatrix();
    }
    value.updateMatrixWorld();
  }

  checkNeedsUpdate(value);
}
