import { EventEmitter } from '@angular/core';
import { pipe, takeUntil, tap, withLatestFrom } from 'rxjs';
import { NgtComponentStore } from '../stores/component-store';
import { skipFirstUndefined } from '../stores/skip-first-undefined';
import { is } from './is';

export function createPassThroughOutput<TObject extends NgtComponentStore>(wrapper: TObject, host: TObject) {
  return (key: keyof TObject) => {
    const wrapperEvent = wrapper[key];
    const hostEvent = host[key];
    if (wrapperEvent instanceof EventEmitter && hostEvent instanceof EventEmitter && wrapperEvent.observed) {
      hostEvent.pipe(takeUntil(wrapper.destroy$)).subscribe(wrapperEvent.emit.bind(wrapperEvent));
    }
  };
}

export function createPassThroughInput<TObject extends NgtComponentStore>(wrapper: TObject, host: TObject) {
  return (key: keyof TObject, useMergeValue = false) => {
    const wrapper$ = wrapper.select((s) => s[key]).pipe(skipFirstUndefined());
    const host$ = host.select((s) => s[key]);

    wrapper.effect(
      pipe(
        withLatestFrom(host$),
        tap(([wrapperValue, hostValue]) => {
          const isExplicitSetOnHost = host.getState((s) => s[(key as string) + 'Explicit']);

          if (isExplicitSetOnHost) {
            return;
          }

          if (!is.equ(wrapperValue, hostValue)) {
            host.set({ [key]: wrapperValue });
          }
        })
      )
    )(wrapper$);
  };
}
