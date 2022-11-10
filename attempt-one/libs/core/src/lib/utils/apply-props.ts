import * as THREE from 'three';
import type {
  AnyCtor,
  AnyFunction,
  NgtInstanceLocalState,
  NgtInstanceNode,
  UnknownRecord,
} from '../types';
import { checkNeedsUpdate } from './check-needs-update';
import { getInstanceInternal } from './instance';
import { is } from './is';

export function applyProps<TInstance extends object = UnknownRecord>(
  instance: TInstance,
  props: UnknownRecord
): void {
  // props is empty
  if (!Object.keys(props).length) return;

  const instanceInternal: NgtInstanceLocalState =
    getInstanceInternal(instance) || ({} as NgtInstanceLocalState);
  const rootState = instanceInternal.stateGetter?.() ?? {};

  if ('__ngt__' in props) {
    (instance as NgtInstanceNode).__ngt__ = getInstanceInternal(
      props
    ) as NgtInstanceLocalState;
  }

  for (const entry of Object.entries(props)) {
    const key = entry[0];
    let prop = entry[1];

    // raycast is null or undefined. we'll skip
    if (key === 'raycast' && prop == undefined) continue;

    if (is.ref(prop)) {
      prop = prop.value;
    }

    const currentInstance = instance;
    const target = (currentInstance as UnknownRecord)[key] as UnknownRecord;

    if (
      target &&
      target['set'] &&
      (target['copy'] || target instanceof THREE.Layers)
    ) {
      // If value is an array
      if (is.arr(prop)) {
        if (target['fromArray']) (target['fromArray'] as AnyFunction)(prop);
        else (target['set'] as AnyFunction)(...prop);
      } else if (
        target['copy'] &&
        prop &&
        (prop as AnyCtor).constructor &&
        target.constructor.name === (prop as AnyCtor).constructor.name
      ) {
        (target['copy'] as AnyFunction)(prop);
      } // If nothing else fits, just set the single value, ignore undefined
      // https://github.com/pmndrs/react-three-fiber/issues/274
      else if (prop !== undefined) {
        const isColor = target instanceof THREE.Color;
        // Allow setting array scalars
        if (!isColor && target['setScalar']) {
          (target['setScalar'] as AnyFunction)(prop);
        }
        // Layers have no copy function, we must therefore copy the mask property
        else if (
          target instanceof THREE.Layers &&
          prop instanceof THREE.Layers
        ) {
          target.mask = prop.mask;
        }
        // Otherwise just set ...
        else {
          (target['set'] as AnyFunction)(prop);
        }
        // For versions of three which don't support THREE.ColorManagement,
        // Auto-convert sRGB colors
        // https://github.com/pmndrs/react-three-fiber/issues/344
        if (!is.supportColorManagement() && !rootState.linear && isColor) {
          target.convertSRGBToLinear();
        }
      }
    } else {
      (currentInstance as UnknownRecord)[key] = prop;
      // Auto-convert sRGB textures, for now ...
      // https://github.com/pmndrs/react-three-fiber/issues/344
      if (
        !rootState.linear &&
        (currentInstance as UnknownRecord)[key] instanceof THREE.Texture
      ) {
        ((currentInstance as UnknownRecord)[key] as THREE.Texture).encoding =
          THREE.sRGBEncoding;
      }
    }

    checkNeedsUpdate(prop);
    checkNeedsUpdate(target);
  }
}
