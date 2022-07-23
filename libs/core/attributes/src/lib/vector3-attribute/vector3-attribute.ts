// GENERATED
import { make, NgtInstance, provideNgtInstance, provideInstanceRef, NgtVector3 } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import type { Subscription } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-vector3[vector3]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtInstance(NgtVector3Attribute), provideInstanceRef(NgtVector3Attribute)],
})
export class NgtVector3Attribute extends NgtInstance<THREE.Vector3> {
  @Input() set vector3(vector3: NgtVector3) {
    this.zone.runOutsideAngular(() => {
      if (this.initSubscription) {
        this.initSubscription.unsubscribe();
      }

      this.initSubscription = this.store.onReady(() => {
        this.prepareInstance(make(THREE.Vector3, vector3));
        return () => {
          this.initSubscription?.unsubscribe();
        };
      });
    });
  }

  private initSubscription?: Subscription;
}

@NgModule({
  imports: [NgtVector3Attribute],
  exports: [NgtVector3Attribute],
})
export class NgtVector3AttributeModule {}
