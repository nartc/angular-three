import {
  AnyFunction,
  NgtInstance,
  NgtPrepareInstanceFn,
  provideInstanceRef,
  provideNgtInstance,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ngt-primitive[ref]',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtInstance(NgtPrimitive),
    provideInstanceRef(NgtPrimitive),
  ],
})
export class NgtPrimitive<
  TInstance extends object
> extends NgtInstance<TInstance> {
  override isPrimitive = true;

  @Input() set props(props: Record<string, unknown>) {
    this.set({ props });
  }

  override setOptionsTrigger$ = this.select((s) => s['props']);

  override preInit() {
    super.preInit();
    this.set((s) => ({
      props: s['props'] ?? {},
    }));
  }

  override initFn(
    prepareInstance: NgtPrepareInstanceFn<TInstance>
  ): void | (() => void) | undefined {
    const instance = prepareInstance(this.instanceValue);
    return () => {
      if ('dispose' in instance) {
        (instance['dispose'] as AnyFunction)();
      }
    };
  }

  override get optionsFields(): Record<string, boolean> {
    const propsOptionsFields = Object.keys(this.get((s) => s['props'])).reduce(
      (fields: Record<string, boolean>, propKey) => {
        fields[propKey] = false;
        return fields;
      },
      {}
    );
    return {
      ...super.optionsFields,
      ...propsOptionsFields,
    };
  }
}
