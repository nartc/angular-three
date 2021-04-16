import type {
  InstanceInternal,
  ThreeInstance,
} from '@angular-three/core/typings';

/**
 * Apply props on instances
 *
 * @internal
 * @private
 */
export function applyProps(
  instance: ThreeInstance,
  props?: Record<string, unknown>
) {
  if (!props || (props && !Object.keys(props).length)) return;

  if ('__ngt' in props) {
    instance['__ngt'] = props['__ngt'] as InstanceInternal;
  }

  if (
    ((instance as unknown) as Record<string, unknown>)['set'] != null &&
    typeof ((instance as unknown) as Record<string, unknown>)['set'] ===
      'function'
  ) {
    (((instance as unknown) as Record<string, unknown>)['set'] as Function)(
      props
    );
  }

  for (const [key, propAtKey] of Object.entries(props)) {
    if (instance[key as keyof ThreeInstance] == null) {
      ((instance as unknown) as Record<string, unknown>)[key] = propAtKey;
    } else {
      if (
        (instance[key as keyof ThreeInstance] as Record<string, unknown>)[
          'set'
        ] != null &&
        typeof (instance[key as keyof ThreeInstance] as Record<
          string,
          unknown
        >)['set'] === 'function'
      ) {
        if (Array.isArray(propAtKey)) {
          ((instance[key as keyof ThreeInstance] as Record<string, unknown>)[
            'set'
          ] as Function)(...propAtKey);
        } else {
          ((instance[key as keyof ThreeInstance] as Record<string, unknown>)[
            'set'
          ] as Function)(propAtKey);
        }
      } else {
        ((instance as unknown) as Record<string, unknown>)[key] = propAtKey;
      }
    }
  }
}
