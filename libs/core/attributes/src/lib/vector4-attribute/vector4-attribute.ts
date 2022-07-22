// GENERATED
import { make, NgtInstance, provideInstanceRef, NgtVector4 } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import type { Subscription } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-vector4[vector4]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideInstanceRef(NgtVector4Attribute)],
})
export class NgtVector4Attribute extends NgtInstance<THREE.Vector4> {
  @Input() set vector4(vector4: NgtVector4) {
    this.zone.runOutsideAngular(() => {
      if (this.initSubscription) {
        this.initSubscription.unsubscribe();
      }

      this.initSubscription = this.store.onReady(() => {
        this.prepareInstance(make(THREE.Vector4, vector4));
        return () => {
          this.initSubscription?.unsubscribe();
        };
      });
    });
  }

  private initSubscription?: Subscription;
}

@NgModule({
  imports: [NgtVector4Attribute],
  exports: [NgtVector4Attribute],
})
export class NgtVector4AttributeModule {}
