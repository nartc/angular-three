import {
  NgtInstance,
  NgtInstanceNode,
  provideInstanceRef,
  provideNgtInstance,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ngt-value[value]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  protected override initFn(
    prepareInstance: (instance: any, uuid?: string) => NgtInstanceNode
  ): (() => void) | void | undefined {
    prepareInstance(this.get((s) => s['value']));
  }
}
