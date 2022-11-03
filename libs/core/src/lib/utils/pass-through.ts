import { merge, takeUntil } from 'rxjs';
import { NgtComponentStore } from '../stores/component-store';
import { is } from './is';

export function createPassThroughOutput<TObject extends NgtComponentStore>(
  wrapper: TObject,
  host: TObject
) {
  return (key: keyof TObject) => {
    const wrapperEvent = wrapper[key];
    const hostEvent = host[key];
    if (
      is.eventEmitter(wrapperEvent) &&
      is.eventEmitter(hostEvent) &&
      wrapperEvent.observed
    ) {
      hostEvent
        .pipe(takeUntil(wrapper.destroy$))
        .subscribe(wrapperEvent.emit.bind(wrapperEvent));
    }
  };
}

export function createPassThroughInput<TObject extends NgtComponentStore>(
  wrapper: TObject,
  host: TObject
) {
  return (
    key: keyof TObject,
    shouldStartWithUndefined = false,
    useMergeValue = false
  ) => {
    const wrapper$ = wrapper.select((s) => s[key], {
      startWithUndefined: shouldStartWithUndefined,
    });
    const host$ = host.select((s) => s[key], {
      startWithUndefined: shouldStartWithUndefined,
    });

    merge(wrapper$, host$)
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe((mergedValue) => {
        if (useMergeValue) {
          host[key] =
            host[key] !== undefined && mergedValue === undefined
              ? host[key]
              : mergedValue;
        } else {
          host[key] = host.get((s) => s[(key as string) + 'Explicit'])
            ? host[key]
            : wrapper[key];
        }
      });
  };
}
