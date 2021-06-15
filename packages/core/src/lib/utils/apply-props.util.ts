import type {
  InstanceInternal,
  ThreeInstance,
  UnknownRecord,
} from '../typings';

function applyDottedPathProps(
  instance: ThreeInstance,
  key: string,
  propAtKey: unknown,
  isRoot = true
) {
  const [first, ...paths] = key.split('.');
  const rootChild = (instance as unknown as UnknownRecord)[first];
  if (rootChild == null) {
    return;
  }

  if (paths.length >= 1) {
    applyDottedPathProps(
      rootChild as unknown as ThreeInstance,
      paths.join('.'),
      propAtKey,
      false
    );
  } else {
    (instance as unknown as UnknownRecord)[first] = propAtKey;
  }

  if (isRoot) {
    checkNeedsUpdate(rootChild);
  }
}

function checkNeedsUpdate(value: unknown) {
  if (typeof value === 'object' && 'needsUpdate' in (value as UnknownRecord)) {
    (value as UnknownRecord)['needsUpdate'] = true;
  }
}

/**
 * Apply props on instances
 *
 * @internal
 * @private
 */
export function applyProps(instance: ThreeInstance, props?: UnknownRecord) {
  if (!props || (props && !Object.keys(props).length)) return;

  if ('__ngt' in props) {
    instance['__ngt'] = props['__ngt'] as InstanceInternal;
  }

  const unknownInstance = instance as unknown as UnknownRecord;

  if (
    unknownInstance['set'] != null &&
    typeof unknownInstance['set'] === 'function'
  ) {
    (unknownInstance['set'] as Function)(props);
  }

  for (const [key, propAtKey] of Object.entries(props)) {
    if (key.split('.').length > 1) {
      applyDottedPathProps(instance, key, propAtKey);
    } else {
      const threeInstancePropAtKey = unknownInstance[key] as UnknownRecord;
      if (threeInstancePropAtKey == null) {
        unknownInstance[key] = propAtKey;
      } else {
        if (
          threeInstancePropAtKey['set'] != null &&
          typeof threeInstancePropAtKey['set'] === 'function'
        ) {
          if (Array.isArray(propAtKey)) {
            if (
              threeInstancePropAtKey['fromArray'] != null &&
              typeof threeInstancePropAtKey['fromArray'] === 'function'
            ) {
              threeInstancePropAtKey['fromArray'](propAtKey);
            } else {
              threeInstancePropAtKey['set'](...propAtKey);
            }
          } else {
            threeInstancePropAtKey['set'](propAtKey);
          }
        } else {
          unknownInstance[key] = propAtKey;
        }
      }
      checkNeedsUpdate(propAtKey);
    }
  }
}
