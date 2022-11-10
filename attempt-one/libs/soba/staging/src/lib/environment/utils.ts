import { is, NgtRef } from '@angular-three/core';
import * as THREE from 'three';

function resolveScene(scene: THREE.Scene | NgtRef<THREE.Scene>) {
  return is.ref(scene) ? scene.value : scene;
}

export function setEnvProps(
  background: boolean | 'only',
  scene: THREE.Scene | NgtRef<THREE.Scene> | undefined,
  defaultScene: THREE.Scene,
  texture: THREE.Texture,
  blur = 0
) {
  const target = resolveScene(scene || defaultScene);
  const oldbg = target.background;
  const oldenv = target.environment;
  const oldBlur = target.backgroundBlurriness || 0;

  console.log({ target });

  if (background !== 'only') target.environment = texture;
  if (background) target.background = texture;
  if (background && target.backgroundBlurriness !== undefined)
    target.backgroundBlurriness = blur;

  return () => {
    if (background !== 'only') target.environment = oldenv;
    if (background) target.background = oldbg;
    if (background && target.backgroundBlurriness !== undefined)
      target.backgroundBlurriness = oldBlur;
  };
}
