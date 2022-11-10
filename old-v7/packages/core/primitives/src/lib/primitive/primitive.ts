import {
  NgtAnyFunction,
  NgtInstance,
  NgtObservableInput,
  NgtPrepareInstanceFn,
  provideInstanceRef,
  provideNgtInstance,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngt-primitive[ref]',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtInstance(NgtPrimitive), provideInstanceRef(NgtPrimitive)],
})
export class NgtPrimitive<TInstance extends object> extends NgtInstance<TInstance> {
  override isPrimitive = true;

  @Input() set props(props: NgtObservableInput<Record<string, unknown>>) {
    this.set({ props });
  }

  override setOptionsTrigger$ = this.select((s) => s['props']);

  override initialize() {
    super.initialize();
    this.set({ props: {} });
  }

  override initFn(prepareInstance: NgtPrepareInstanceFn<TInstance>): void | (() => void) | undefined {
    const instance = prepareInstance(this.instanceValue);
    return () => {
      if ('dispose' in instance) {
        (instance['dispose'] as NgtAnyFunction)();
      }
    };
  }

  override get optionsFields() {
    const propsOptionsFields = Object.keys(this.getState((s) => s['props']));
    return [...super.optionsFields, ...propsOptionsFields];
  }
}
