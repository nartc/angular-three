import { Color, ColorManagement, Layers, sRGBEncoding, Texture } from 'three';
import type { NgtAnyConstructor, NgtAnyFunction, NgtAnyRecord } from '../types';
import { checkNeedsUpdate, invalidateInstance } from './instance';
import { is } from './is';
import { getLocalState } from './local-state';

const DEFAULT = '__default__';

export function diffProps<TInstance extends object>(
  instance: TInstance,
  props: NgtAnyRecord,
  previousProps: NgtAnyRecord = {},
  remove = false
) {
  const localState = getLocalState(instance);
  const propsEntries = Object.entries(props);
  const changes: [key: string, value: unknown][] = [];

  // catch removed props
  if (remove) {
    const previousKeys = Object.keys(previousProps);
    for (const previousKey of previousKeys) {
      if (!Object.hasOwn(props, previousKey)) {
        propsEntries.unshift([previousKey, DEFAULT + 'remove']);
      }
    }
  }

  for (const [propKey, propValue] of propsEntries) {
    if (is.equ(propValue, previousProps[propKey])) continue;
    changes.push([propKey, propValue]);
  }

  const memoized: NgtAnyRecord = { ...props };
  if (localState.memoized && localState.memoized['args']) {
    memoized['args'] = localState.memoized['args'];
  }

  return { changes, memoized };
}

export function applyProps<TInstance extends object>(
  instance: TInstance,
  props: NgtAnyRecord
): TInstance {
  // props is empty
  if (!Object.keys(props).length) return instance;

  // filter equals, events , and reserved props
  const localState = getLocalState(instance);
  const rootState = localState.store.get();
  const { changes, memoized } = diffProps(instance, props);
  const instanceHandlers = localState.eventCount;

  if (localState) {
    localState.memoized = memoized;
  }

  for (let i = 0; i < changes.length; i++) {
    const key = changes[i][0];
    const currentInstance = instance;
    const targetProp = (currentInstance as NgtAnyRecord)[key] as NgtAnyRecord;
    let value = changes[i][1];

    if (value === DEFAULT + 'remove') {
      if (targetProp && targetProp.constructor) {
        // use the prop constructor to find the default
        value = new (targetProp.constructor as NgtAnyConstructor)(
          ...((memoized['args'] as unknown[]) || {})
        );
      } else if (currentInstance.constructor) {
        const dummyInstance = new (currentInstance.constructor as NgtAnyConstructor)(
          ...((getLocalState(currentInstance).memoized?.['args'] as any[]) || [])
        );
        value = dummyInstance[targetProp as unknown as string];
        // destroy the instance
        if (dummyInstance['dispose']) dummyInstance.dispose();
      } else {
        value = 0;
      }
    }

    // special treatmen for objects with support for set/copy, and layers
    if (targetProp && targetProp['set'] && (targetProp['copy'] || targetProp instanceof Layers)) {
      const isColor = targetProp instanceof Color;
      // if value is an array
      if (Array.isArray(value)) {
        if (targetProp['fromArray']) (targetProp['fromArray'] as NgtAnyFunction)(value);
        else (targetProp['set'] as NgtAnyFunction)(...value);
      }
      // test again target.copy
      else if (
        targetProp['copy'] &&
        value &&
        value.constructor &&
        targetProp.constructor.name === value.constructor.name
      ) {
        (targetProp['copy'] as NgtAnyFunction)(value);
        if (!ColorManagement && !rootState.linear && isColor) {
          targetProp['convertSRGBToLinear']();
        }
      }
      // if nothing else fits, just set the single value, ignore undefined
      else if (value !== undefined) {
        const isColor = targetProp instanceof Color;
        // allow setting array scalars
        if (!isColor && targetProp['setScalar']) (targetProp['setScalar'] as NgtAnyFunction)(value);
        // layers have no copy function, copy the mask
        else if (targetProp instanceof Layers && value instanceof Layers) {
          targetProp.mask = value.mask;
        }
        // otherwise just set ...
        else {
          (targetProp['set'] as NgtAnyFunction)(value);
        }

        // auto-convert srgb
        if (!ColorManagement && !rootState.linear && isColor) {
          targetProp.convertSRGBToLinear();
        }
      }
    }
    // else just overwrite the value
    else {
      (currentInstance as NgtAnyRecord)[key] = value;
      // auto-convert srgb textures
      if (!rootState.linear && (currentInstance as NgtAnyRecord)[key] instanceof Texture) {
        ((currentInstance as NgtAnyRecord)[key] as NgtAnyRecord)['encoding'] = sRGBEncoding;
      }
    }

    checkNeedsUpdate(targetProp);
    invalidateInstance(instance);
  }

  if (
    localState.parent &&
    rootState.internal &&
    (instance as NgtAnyRecord)['raycast'] &&
    instanceHandlers !== localState.eventCount
  ) {
    // pre-emptively remove the interaction from manager
    rootState.removeInteraction((instance as THREE.Object3D)['uuid']);
    // add the instance to the interaction manager only when it has handlers
    if (localState.eventCount) rootState.addInteraction(instance as THREE.Object3D);
  }

  return instance;
}
