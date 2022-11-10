import {
  NgtInstance,
  NgtPrepareInstanceFn,
  provideInstanceRef,
  provideNgtInstance,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ngt-value[value]',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtInstance(NgtValueAttribute),
    provideInstanceRef(NgtValueAttribute),
  ],
})
export class NgtValueAttribute extends NgtInstance {
  @Input() set value(value: any) {
    this.set({ value });
  }

  override initTrigger$ = this.select((s) => s['value']);

  override initFn(
    prepareInstance: NgtPrepareInstanceFn<any>
  ): (() => void) | void | undefined {
    prepareInstance(this.get((s) => s['value']));
  }
}
