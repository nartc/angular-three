import { ChangeDetectorRef, EventEmitter, inject } from '@angular/core';

export function createEventEmitter<T>(): EventEmitter<T> {
  const cdr = inject(ChangeDetectorRef);
  const parentCdr = inject(ChangeDetectorRef, { skipSelf: true, optional: true });

  const eventEmitter = new EventEmitter<T>();

  const originalEmit = eventEmitter.emit.bind(eventEmitter);

  eventEmitter.emit = (...args: Parameters<EventEmitter<T>['emit']>) => {
    originalEmit(...args);
    cdr.detectChanges();
    if (parentCdr) {
      parentCdr.detectChanges();
    }
  };

  return eventEmitter;
}
