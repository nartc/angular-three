import { BehaviorSubject } from 'rxjs';

export class NgtRef<TValue = any> extends BehaviorSubject<TValue> {
  constructor(value?: TValue | null) {
    super((value ? value : null) as TValue);
  }

  set(value: ((prev: TValue) => TValue) | TValue) {
    if (typeof value === 'function') {
      this.next((value as (prev: TValue) => TValue)(this.value));
    } else {
      this.next(value);
    }
  }
}
