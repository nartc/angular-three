// GENERATED
import { make, NgtInstance, provideNgtInstance, provideInstanceRef, NgtMatrix3 } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import type { Subscription } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-matrix3[matrix3]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtInstance(NgtMatrix3Attribute), provideInstanceRef(NgtMatrix3Attribute)],
})
export class NgtMatrix3Attribute extends NgtInstance<THREE.Matrix3> {
  @Input() set matrix3(matrix3: NgtMatrix3) {
    this.zone.runOutsideAngular(() => {
      if (this.initSubscription) {
        this.initSubscription.unsubscribe();
      }

      this.initSubscription = this.store.onReady(() => {
        this.prepareInstance(make(THREE.Matrix3, matrix3));
        return () => {
          this.initSubscription?.unsubscribe();
        };
      });
    });
  }

  private initSubscription?: Subscription;
}

@NgModule({
  imports: [NgtMatrix3Attribute],
  exports: [NgtMatrix3Attribute],
})
export class NgtMatrix3AttributeModule {}
