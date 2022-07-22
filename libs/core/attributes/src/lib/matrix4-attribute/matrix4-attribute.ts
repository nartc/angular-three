// GENERATED
import { make, NgtInstance, provideInstanceRef, NgtMatrix4 } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import type { Subscription } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-matrix4[matrix4]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideInstanceRef(NgtMatrix4Attribute)],
})
export class NgtMatrix4Attribute extends NgtInstance<THREE.Matrix4> {
  @Input() set matrix4(matrix4: NgtMatrix4) {
    this.zone.runOutsideAngular(() => {
      if (this.initSubscription) {
        this.initSubscription.unsubscribe();
      }

      this.initSubscription = this.store.onReady(() => {
        this.prepareInstance(make(THREE.Matrix4, matrix4));
        return () => {
          this.initSubscription?.unsubscribe();
        };
      });
    });
  }

  private initSubscription?: Subscription;
}

@NgModule({
  imports: [NgtMatrix4Attribute],
  exports: [NgtMatrix4Attribute],
})
export class NgtMatrix4AttributeModule {}
