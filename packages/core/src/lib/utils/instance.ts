import { BehaviorSubject } from 'rxjs';
import type { NgtAnyRecord, NgtInstanceLocalState, NgtInstanceNode } from '../types';
import { checkUpdate } from './update';

export function getLocalState<TInstance extends object = NgtAnyRecord>(
  obj: TInstance | undefined
): NgtInstanceLocalState {
  if (!obj) return {} as unknown as NgtInstanceLocalState;
  return (obj as NgtAnyRecord)['__ngt__'] as NgtInstanceLocalState;
}

export function invalidateInstance<TInstance extends object>(instance: TInstance) {
  const state = getLocalState(instance)?.store.get();
  if (state && state?.internal?.frames === 0) state.invalidate();
  checkUpdate(instance);
}

export function prepare<TInstance extends object = NgtAnyRecord>(
  object: TInstance,
  localState?: Partial<NgtInstanceLocalState>
): NgtInstanceNode<TInstance> {
  const instance = object as unknown as NgtInstanceNode<TInstance>;

  if (localState?.primitive || !instance.__ngt__) {
    const {
      objects = new BehaviorSubject<NgtInstanceNode[]>([]),
      nonObjects = new BehaviorSubject<NgtInstanceNode[]>([]),
      ...rest
    } = localState || {};

    instance.__ngt__ = {
      previousAttach: null,
      store: null,
      parent: null,
      parentDom: null,
      memoized: {},
      eventCount: 0,
      handlers: {},
      objects,
      nonObjects,
      addObject: (object) => objects.next([...objects.value, object]),
      removeObject: (object) => objects.next(objects.value.filter((obj) => obj !== object)),
      addNonObject: (object) => nonObjects.next([...nonObjects.value, object]),
      removeNonObject: (object) =>
        nonObjects.next(nonObjects.value.filter((obj) => obj !== object)),
      compound: {
        applyFirst: true,
        isCompound: false,
        shouldApplyFirst(propName) {
          return this.props && propName in this.props && !this.applyFirst;
        },
      },
      ...rest,
    } as NgtInstanceLocalState;
  }

  return instance;
}
