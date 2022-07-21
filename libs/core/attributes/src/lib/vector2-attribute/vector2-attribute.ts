// GENERATED
import { makeVector2, NgtInstance, provideInstanceRef, NgtVector2 } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import type { Subscription } from 'rxjs';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-vector2[vector2]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideInstanceRef(NgtVector2Attribute)],
})
export class NgtVector2Attribute extends NgtInstance<THREE.Vector2> {
  @Input() set vector2(vector2: NgtVector2) {
    this.zone.runOutsideAngular(() => {
      if (this.initSubscription) {
        this.initSubscription.unsubscribe();
      }

      this.initSubscription = this.onCanvasReady(
        this.store.ready$,
        () => {
          this.prepareInstance(makeVector2(vector2));
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
  imports: [NgtVector2Attribute],
  exports: [NgtVector2Attribute],
})
export class NgtVector2AttributeModule {}
