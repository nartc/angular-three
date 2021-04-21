import { NgZone } from '@angular/core';
import { MonoTypeOperatorFunction } from 'rxjs';
import { tap } from 'rxjs/operators';

export function runOutsideAngular<T>(
  zone: NgZone,
  next: (value: T, run: typeof NgZone.prototype.run) => void
): MonoTypeOperatorFunction<T> {
  return tap((value) => {
    zone.runOutsideAngular(() => {
      next(value, zone.run.bind(zone));
    });
  });
}
