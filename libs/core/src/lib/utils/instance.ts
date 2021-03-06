import { map, Observable, of, pairwise, startWith } from 'rxjs';
import { Ref } from '../ref';
import { NgtComponentStore, startWithUndefined } from '../stores/component-store';
import type { NgtInstanceInternal, NgtState, NgtUnknownInstance, UnknownRecord } from '../types';
import { applyProps } from './apply-props';
import { checkNeedsUpdate } from './check-needs-update';
import { is } from './is';

export function getInstanceInternal<T extends object = UnknownRecord>(
  obj: T | undefined
): NgtInstanceInternal | undefined {
  if (!obj) return undefined;
  return (obj as UnknownRecord)['__ngt__'] as NgtInstanceInternal;
}

export function prepare<TInstance extends object = UnknownRecord>(
  instance: TInstance,
  root: () => NgtState,
  parentInstance?: Ref,
  previousInstance?: Ref,
  isPrimitive = false
): NgtUnknownInstance<TInstance> {
  const previousInstanceInternal = getInstanceInternal(previousInstance?.value);

  const parent = parentInstance
    ? parentInstance
    : previousInstanceInternal
    ? previousInstanceInternal.parent
    : undefined;

  if (is.scene(instance)) {
    applyProps(instance, { dispose: null });
  }

  return Object.assign(instance, {
    __ngt__: {
      root,
      primitive: !isPrimitive ? previousInstanceInternal?.primitive : isPrimitive,
      eventCount: previousInstanceInternal?.eventCount ?? 0,
      handlers: previousInstanceInternal?.handlers ?? {},
      objects: previousInstanceInternal?.objects ?? new Ref([] as Ref[]),
      parent: parent ? (parent === instance ? null : parent) : null,
    },
  });
}

export function optionsFieldsToOptions(
  instance: NgtComponentStore,
  fields: Record<string, boolean>,
  keepPrevious = false
): Observable<UnknownRecord> {
  const optionEntries = Object.entries(fields);
  if (optionEntries.length === 0) return of({});
  return instance
    .select(
      ...optionEntries.map(([inputKey, shouldStartWithUndefined]) => {
        const subInput$ = instance.select((s) => (s as UnknownRecord)[inputKey]);
        if (shouldStartWithUndefined) return subInput$.pipe(startWithUndefined());
        return subInput$;
      }),
      (...args: any[]) =>
        args.reduce((record, arg, index) => {
          record[optionEntries[index][0]] = arg;
          return record;
        }, {} as UnknownRecord)
    )
    .pipe(
      startWith({}),
      pairwise(),
      map(([prev, curr]) =>
        Object.entries(curr).reduce((options, [currKey, currValue]) => {
          if (!is.equ(prev[currKey], currValue) || (keepPrevious && is.equ(prev[currKey], currValue))) {
            options[currKey] = currValue;
          }
          return options;
        }, {} as UnknownRecord)
      )
    );
}

export function checkUpdate(value: unknown): void {
  if (is.object3d(value)) {
    value.updateMatrix();
  } else if (is.camera(value)) {
    if (is.perspective(value) || is.orthographic(value)) {
      value.updateProjectionMatrix();
    }
    value.updateMatrixWorld();
  }

  checkNeedsUpdate(value);
}
