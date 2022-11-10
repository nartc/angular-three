import { map, Observable, of, pairwise, startWith } from 'rxjs';
import { NgtRef } from '../ref';
import { NgtComponentStore } from '../stores/component-store';
import type { NgtInstanceNode, NgtStateGetter, NgtUnknownRecord } from '../types';
import { applyProps } from './apply-props';
import { checkUpdate } from './check-update';
import { getInstanceLocalState } from './get-instance-local-state';
import { is } from './is';

export function invalidateInstance<TInstance extends object>(instance: TInstance) {
  const state = getInstanceLocalState(instance)?.stateGetter();
  if (state && state.internal.frames === 0) state.invalidate();
  checkUpdate(instance);
}

export function prepare<TInstance extends object = NgtUnknownRecord>(
  instance: TInstance,
  parentStateGetter: NgtStateGetter,
  rootStateGetter: NgtStateGetter,
  parentInstance?: NgtRef,
  previousInstance?: NgtRef,
  isPrimitive = false
): NgtInstanceNode<TInstance> {
  const previousInstanceInternal = getInstanceLocalState(previousInstance?.value);

  const parent = parentInstance
    ? parentInstance
    : previousInstanceInternal
    ? previousInstanceInternal.parentRef
    : undefined;

  if (is.scene(instance)) {
    applyProps(instance, { dispose: null });
  }

  return Object.assign(instance, {
    __ngt__: {
      stateGetter: parentStateGetter,
      rootGetter: rootStateGetter,
      isPrimitive: !isPrimitive ? previousInstanceInternal?.isPrimitive : isPrimitive,
      eventCount: previousInstanceInternal?.eventCount ?? 0,
      handlers: previousInstanceInternal?.handlers ?? {},
      instancesRefs: previousInstanceInternal?.instancesRefs ?? new NgtRef([] as NgtRef[]),
      objectsRefs: previousInstanceInternal?.objectsRefs ?? new NgtRef([] as NgtRef[]),
      parentRef: parent ? (parent === instance || parent.value === instance ? null : parent) : null,
    },
  });
}

export function optionsFieldsToKeys$(
  instance: NgtComponentStore,
  fields: string[],
  keepPrevious = false
): Observable<string[]> {
  if (fields.length === 0) return of([]);
  return instance
    .select(
      fields.reduce((selectorObjects, field) => {
        selectorObjects[field] = instance.select((s) => s[field]);
        return selectorObjects;
      }, {} as Record<string, any>),
      { debounce: true }
    )
    .pipe(
      startWith({}),
      pairwise(),
      map(([previous, current]) => {
        return Object.entries(current).reduce((optionsKeys: string[], [currKey, currValue]) => {
          if (
            !is.equ((previous as NgtUnknownRecord)[currKey], currValue) ||
            (keepPrevious && is.equ((previous as NgtUnknownRecord)[currKey], currValue))
          ) {
            optionsKeys.push(currKey);
          }
          return optionsKeys;
        }, []);
      })
    );
}
