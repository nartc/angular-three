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
  const rootChild = ((instance as unknown) as UnknownRecord)[first];
  if (rootChild == null) {
    return;
  }

  if (paths.length >= 1) {
    applyDottedPathProps(
      (rootChild as unknown) as ThreeInstance,
      paths.join('.'),
      propAtKey,
      false
    );
  } else {
    ((instance as unknown) as UnknownRecord)[first] = propAtKey;
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

  if (
    ((instance as unknown) as UnknownRecord)['set'] != null &&
    typeof ((instance as unknown) as UnknownRecord)['set'] === 'function'
  ) {
    (((instance as unknown) as UnknownRecord)['set'] as Function)(props);
  }

  for (const [key, propAtKey] of Object.entries(props)) {
    if (key.split('.').length > 1) {
      applyDottedPathProps(instance, key, propAtKey);
    } else {
      if (instance[key as keyof ThreeInstance] == null) {
        ((instance as unknown) as UnknownRecord)[key] = propAtKey;
      } else {
        if (
          (instance[key as keyof ThreeInstance] as UnknownRecord)['set'] !=
            null &&
          typeof (instance[key as keyof ThreeInstance] as Record<
            string,
            unknown
          >)['set'] === 'function'
        ) {
          if (Array.isArray(propAtKey)) {
            ((instance[key as keyof ThreeInstance] as UnknownRecord)[
              'set'
            ] as Function)(...propAtKey);
          } else {
            ((instance[key as keyof ThreeInstance] as UnknownRecord)[
              'set'
            ] as Function)(propAtKey);
          }
        } else {
          ((instance as unknown) as UnknownRecord)[key] = propAtKey;
        }
      }
      checkNeedsUpdate(propAtKey);
    }
  }
}
