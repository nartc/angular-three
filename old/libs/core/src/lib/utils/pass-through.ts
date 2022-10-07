import { merge, takeUntil } from 'rxjs';
import { NgtComponentStore, startWithUndefined } from '../stores/component-store';
import { is } from './is';

export function createPassThroughOutput<TObject extends NgtComponentStore>(wrapper: TObject, host: TObject) {
  return (key: keyof TObject) => {
    const wrapperEvent = wrapper[key];
    const hostEvent = host[key];
    if (is.eventEmitter(wrapperEvent) && is.eventEmitter(hostEvent) && wrapperEvent.observed) {
      hostEvent.pipe(takeUntil(wrapper.destroy$)).subscribe(wrapperEvent.emit.bind(wrapperEvent));
    }
  };
}

export function createPassThroughInput<TObject extends NgtComponentStore>(wrapper: TObject, host: TObject) {
  return (key: keyof TObject, shouldStartWithUndefined = false, useMergeValue = false) => {
    let wrapper$ = wrapper.select((s) => s[key]);
    let host$ = host.select((s) => s[key]);

    if (shouldStartWithUndefined) {
      wrapper$ = wrapper$.pipe(startWithUndefined());
      host$ = host$.pipe(startWithUndefined());
    }

    merge(wrapper$, host$)
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe((mergedValue) => {
        if (useMergeValue) {
          host[key] = host[key] !== undefined && mergedValue === undefined ? host[key] : mergedValue;
        } else {
          host[key] = host.get((s) => s[(key as any) + 'Explicit']) ? host[key] : wrapper[key];
        }
      });
  };
}
