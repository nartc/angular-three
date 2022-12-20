import { BehaviorSubject } from 'rxjs';
import type { NgtAnyRecord, NgtInstanceLocalState, NgtInstanceNode } from '../types';

export function prepare<TInstance extends object = NgtAnyRecord>(
  object: TInstance,
  localState?: Partial<NgtInstanceLocalState>
): NgtInstanceNode<TInstance> {
  const instance = object as unknown as NgtInstanceNode;

  if (localState?.primitive || !instance.__ngt__) {
    const {
      objects = new BehaviorSubject<NgtInstanceNode[]>([]),
      nonObjects = new BehaviorSubject<NgtInstanceNode[]>([]),
      ...rest
    } = localState || {};

    instance.__ngt__ = {
      attachValue: null,
      store: null,
      parent: null,
      memoized: {},
      eventCount: 0,
      handlers: {},
      objects,
      nonObjects,
      addObject: (object) => objects.next([...objects.value, object]),
      addNonObject: (object) => nonObjects.next([...objects.value, object]),
      wrapper: { applyFirst: true },
      ...rest,
    } as NgtInstanceLocalState;
  }

  return instance;
}
