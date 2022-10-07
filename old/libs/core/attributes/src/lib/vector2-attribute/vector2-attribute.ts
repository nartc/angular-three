// GENERATED
import { make, NgtInstance, provideNgtInstance, provideInstanceRef, NgtVector2 } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import type { Subscription } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-vector2[vector2]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtInstance(NgtVector2Attribute), provideInstanceRef(NgtVector2Attribute)],
})
export class NgtVector2Attribute extends NgtInstance<THREE.Vector2> {
  @Input() set vector2(vector2: NgtVector2) {
    this.zone.runOutsideAngular(() => {
      if (this.initSubscription) {
        this.initSubscription.unsubscribe();
      }

      this.initSubscription = this.store.onReady(() => {
        this.prepareInstance(make(THREE.Vector2, vector2));
        return () => {
          this.initSubscription?.unsubscribe();
        };
      });
    });
  }

  private initSubscription?: Subscription;
}

@NgModule({
  imports: [NgtVector2Attribute],
  exports: [NgtVector2Attribute],
})
export class NgtVector2AttributeModule {}
