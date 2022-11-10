import { NgtInstance, NgtPrepareInstanceFn, provideInstanceRef, provideNgtInstance } from '@angular-three/core';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngt-value[value]',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtInstance(NgtValueAttribute), provideInstanceRef(NgtValueAttribute)],
})
export class NgtValueAttribute extends NgtInstance {
  override isRaw = true;

  @Input() set value(value: any) {
    this.set({ value });
  }

  override initTrigger$ = this.select((s) => s['value']);

  override initFn(prepareInstance: NgtPrepareInstanceFn<any>): (() => void) | void | undefined {
    // TODO: this is a hack, we should not need to run this on the next frame
    queueMicrotask(() => {
      prepareInstance(this.getState((s) => s['value']));
    });
  }
}
