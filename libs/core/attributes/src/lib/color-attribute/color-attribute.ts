// GENERATED
import { makeColor, NgtColor, NgtInstance, provideInstanceRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import type { Subscription } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-color[color]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideInstanceRef(NgtColorAttribute)],
})
export class NgtColorAttribute extends NgtInstance<THREE.Color> {
  @Input() set color(color: NgtColor) {
    this.zone.runOutsideAngular(() => {
      if (this.initSubscription) {
        this.initSubscription.unsubscribe();
      }

      this.initSubscription = this.store.onReady(() => {
        this.prepareInstance(makeColor(color));
        return () => {
          this.initSubscription?.unsubscribe();
        };
      });
    });
  }

  private initSubscription?: Subscription;
}

@NgModule({
  imports: [NgtColorAttribute],
  exports: [NgtColorAttribute],
})
export class NgtColorAttributeModule {}
