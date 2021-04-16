import { ComponentStore } from '@ngrx/component-store';

export abstract class ImperativeComponentStore<
  T extends object
> extends ComponentStore<T> {
  getImperativeState(): T {
    return this.get();
  }
}
