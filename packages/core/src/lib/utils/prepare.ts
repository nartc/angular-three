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
      removeObject: (object) => objects.next(objects.value.filter((obj) => obj !== object)),
      addNonObject: (object) => nonObjects.next([...nonObjects.value, object]),
      removeNonObject: (object) =>
        nonObjects.next(nonObjects.value.filter((obj) => obj !== object)),
      wrapper: { applyFirst: true },
      ...rest,
    } as NgtInstanceLocalState;
  }

  return instance;
}

/**
 * export function prepare<TInstance extends object = NgtAnyRecord>(
 *   object: TInstance,
 *   localState?: Partial<NgtInstanceLocalState>,
 *   rendererState?: Partial<NgtInstanceRendererState>
 * ): NgtInstanceNode<TInstance> {
 *   const instance = object as unknown as NgtInstanceNode;
 *
 *   if (localState?.primitive || !instance.__ngt__) {
 *     instance.__ngt__ = {
 *       attachValue: null,
 *       store: null,
 *       parent: null,
 *       memoized: {},
 *       eventCount: 0,
 *       handlers: {},
 *       objects: create<NgtInstanceNode[]>(() => []),
 *       nonObjects: create<NgtInstanceNode[]>(() => []),
 *       wrapper: { applyFirst: true },
 *       ...(localState || {}),
 *     } as NgtInstanceLocalState;
 *   }
 *
 *   if (!instance.__ngt_renderer__) {
 *     instance.__ngt_renderer__ = {
 *       instance: undefined,
 *       parent: localState?.parent,
 *       cleanUps: new Set(),
 *       ...(rendererState || {}),
 *     };
 *   }
 *
 *   if (is.three(instance) || localState?.primitive) {
 *     instance.__ngt_renderer__.instance = instance;
 *   }
 *
 *   if (is.html(instance)) {
 *     instance.__ngt_renderer__.dom = instance as HTMLElement;
 *   }
 *
 *   return instance;
 * }
 */
