// GENERATED
import { makeColor, NgtInstance, provideInstanceRef, NgtColor } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import type { Subscription } from 'rxjs';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-color[color]',
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

      this.initSubscription = this.onCanvasReady(
        this.store.ready$,
        () => {
          this.prepareInstance(makeColor(color));
          return () => {
            this.initSubscription?.unsubscribe();
          };
        },
        true
      );
    });
  }

  private initSubscription?: Subscription;
}

@NgModule({
  declarations: [NgtColorAttribute],
  exports: [NgtColorAttribute],
})
export class NgtColorAttributeModule {}
