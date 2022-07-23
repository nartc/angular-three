// GENERATED
import { make, NgtInstance, provideNgtInstance, provideInstanceRef, NgtFog } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import type { Subscription } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-fog[fog]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtInstance(NgtFogAttribute), provideInstanceRef(NgtFogAttribute)],
})
export class NgtFogAttribute extends NgtInstance<THREE.Fog> {
  @Input() set fog(fog: NgtFog) {
    this.zone.runOutsideAngular(() => {
      if (this.initSubscription) {
        this.initSubscription.unsubscribe();
      }

      this.initSubscription = this.store.onReady(() => {
        this.prepareInstance(make(THREE.Fog, fog));
        return () => {
          this.initSubscription?.unsubscribe();
        };
      });
    });
  }

  private initSubscription?: Subscription;
}

@NgModule({
  imports: [NgtFogAttribute],
  exports: [NgtFogAttribute],
})
export class NgtFogAttributeModule {}
