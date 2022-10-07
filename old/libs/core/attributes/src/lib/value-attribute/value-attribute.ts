import { NgtInstance, provideInstanceRef, provideNgtInstance } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ngt-value[value]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtInstance(NgtValueAttribute), provideInstanceRef(NgtValueAttribute)],
})
export class NgtValueAttribute extends NgtInstance<any> {
  @Input() set value(value: any) {
    this.zone.runOutsideAngular(() => {
      if (this.initSubscription) {
        this.initSubscription.unsubscribe();
      }

      this.initSubscription = this.store.onReady(() => {
        this.prepareInstance(value);
        return () => {
          this.initSubscription?.unsubscribe();
        };
      });
    });
  }

  override isRaw = true;
  private initSubscription?: Subscription;
}

@NgModule({
  imports: [NgtValueAttribute],
  exports: [NgtValueAttribute],
})
export class NgtValueAttributeModule {}
