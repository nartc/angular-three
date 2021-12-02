import * as THREE from 'three';
import {
  AnyConstructor,
  NgtInstance,
  NgtInstanceInternal,
  UnknownRecord,
} from '../models';

function checkNeedsUpdate(value: unknown) {
  if (
    value !== null &&
    typeof value === 'object' &&
    'needsUpdate' in (value as UnknownRecord)
  ) {
    (value as UnknownRecord)['needsUpdate'] = true;
  }
}

export function applyProps(instance: NgtInstance, props: UnknownRecord) {
  if (!Object.keys(props).length) return;

  if ('__ngt' in props) {
    instance['__ngt'] = props['__ngt'] as NgtInstanceInternal;
  }

  const unknownInstance = instance as unknown as UnknownRecord;

  if (
    unknownInstance['set'] != null &&
    typeof unknownInstance['set'] === 'function'
  ) {
    try {
      (unknownInstance['set'] as Function)(props);
    } catch (e) {
      console.info(
        `Swallowing erroneous "set" invoke on ${unknownInstance.constructor.name} as non fatal: ${e}`
      );
    }
  }

  for (const [key, prop] of Object.entries(props)) {
    const currentInstance = unknownInstance;
    const targetProp = currentInstance[key] as UnknownRecord;

    if (
      targetProp &&
      targetProp['set'] &&
      (targetProp['copy'] || targetProp instanceof THREE.Layers)
    ) {
      if (Array.isArray(prop)) {
        if (targetProp.fromArray) (targetProp.fromArray as Function)(prop);
        else (targetProp.set as Function)(...prop);
      } else if (
        targetProp.copy &&
        prop &&
        (prop as AnyConstructor<unknown>).constructor &&
        targetProp.constructor.name ===
          (prop as AnyConstructor<unknown>).constructor.name
      ) {
        (targetProp.copy as Function)(prop);
      } else if (prop !== undefined) {
        const isColor = targetProp instanceof THREE.Color;
        // Allow setting array scalars
        if (!isColor && targetProp.setScalar)
          (targetProp.setScalar as Function)(prop);
        // Layers have no copy function, we must therefore copy the mask property
        else if (
          targetProp instanceof THREE.Layers &&
          prop instanceof THREE.Layers
        )
          targetProp.mask = prop.mask;
        // Otherwise just set ...
        else (targetProp.set as Function)(prop);
        // Auto-convert sRGB colors, for now ...
        // https://github.com/pmndrs/react-three-fiber/issues/344
        if (!currentInstance.linear && isColor)
          (targetProp as unknown as THREE.Color).convertSRGBToLinear();
      }
    } else {
      currentInstance[key] = prop;
      // Auto-convert sRGB textures, for now ...
      // https://github.com/pmndrs/react-three-fiber/issues/344
      if (
        !currentInstance.linear &&
        currentInstance[key] instanceof THREE.Texture
      )
        (currentInstance[key] as THREE.Texture).encoding = THREE.sRGBEncoding;
    }

    checkNeedsUpdate(prop);
    checkNeedsUpdate(targetProp);
  }
}
