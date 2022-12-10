import create from 'zustand/vanilla';
import type {
  NgtAnyRecord,
  NgtInstanceLocalState,
  NgtInstanceNode,
  NgtInstanceRendererState,
} from '../types';
import { instanceRendererState } from './instance-local-state';
import { is } from './is';

export function prepare<TInstance extends object = NgtAnyRecord>(
  object: TInstance,
  localState?: Partial<NgtInstanceLocalState>
): NgtInstanceNode<TInstance> {
  const instance = object as unknown as NgtInstanceNode;

  if (localState?.primitive || !instance.__ngt__) {
    instance.__ngt__ = {
      attachValue: null,
      store: null,
      parent: null,
      memoized: {},
      eventCount: 0,
      handlers: {},
      objects: create<NgtInstanceNode[]>(() => []),
      nonObjects: create<NgtInstanceNode[]>(() => []),
      __ngt_renderer__: create<NgtInstanceRendererState>(() => ({
        instance: undefined,
        parent: localState?.parent,
        cleanUps: new Set(),
      })),
      ...localState,
    } as NgtInstanceLocalState;
  }

  if (instance.__ngt__) {
    if (localState?.__ngt_renderer__) {
      instanceRendererState(instance)?.setState((state) => ({
        ...state,
        ...localState.__ngt_renderer__,
      }));
    }
  }

  if (is.three(instance) || localState?.primitive) {
    instanceRendererState(instance)?.setState({ instance });
  }

  return instance;
}
