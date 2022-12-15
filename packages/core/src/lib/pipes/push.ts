import { ChangeDetectorRef, inject, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { isObservable, ObservableInput, Subscription } from 'rxjs';

function isPromise(value: unknown): value is Promise<unknown> {
  return (
    (value instanceof Promise || Object.prototype.toString.call(value) === '[object Promise]') &&
    typeof (value as Promise<unknown>)['then'] === 'function'
  );
}

@Pipe({ name: 'ngtPush', pure: false, standalone: true })
export class NgtPush<T> implements PipeTransform, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly parentCdr = inject(ChangeDetectorRef, { skipSelf: true, optional: true });

  private subscription?: Subscription;
  private obj?: ObservableInput<T>;
  private latestValue?: T;

  transform(value: ObservableInput<T>, defaultValue?: T): T {
    if (this.obj === value) {
      return this.latestValue as T;
    }

    this.obj = value;
    this.latestValue = defaultValue;

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (isObservable(this.obj)) {
      this.subscription = this.obj.subscribe(this.updateValue.bind(this));
    } else if (isPromise(this.obj)) {
      (this.obj as Promise<T>).then(this.updateValue.bind(this));
    } else {
      throw new Error(`[NGT] Invalid value passed to ngtPush pipe`);
    }

    return this.latestValue as T;
  }

  private updateValue(val: T) {
    this.latestValue = val;
    if (this.parentCdr) {
      this.parentCdr.detectChanges();
    } else {
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.latestValue = undefined;
    this.obj = undefined;
  }
}
