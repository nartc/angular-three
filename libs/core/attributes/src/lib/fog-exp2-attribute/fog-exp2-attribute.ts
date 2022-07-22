// GENERATED
import { make, NgtInstance, provideInstanceRef, NgtFogExp2 } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import type { Subscription } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-fog-exp2[fogExp2]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideInstanceRef(NgtFogExp2Attribute)],
})
export class NgtFogExp2Attribute extends NgtInstance<THREE.FogExp2> {
  @Input() set fogExp2(fogExp2: NgtFogExp2) {
    this.zone.runOutsideAngular(() => {
      if (this.initSubscription) {
        this.initSubscription.unsubscribe();
      }

      this.initSubscription = this.store.onReady(() => {
        this.prepareInstance(make(THREE.FogExp2, fogExp2));
        return () => {
          this.initSubscription?.unsubscribe();
        };
      });
    });
  }

  private initSubscription?: Subscription;
}

@NgModule({
  imports: [NgtFogExp2Attribute],
  exports: [NgtFogExp2Attribute],
})
export class NgtFogExp2AttributeModule {}
