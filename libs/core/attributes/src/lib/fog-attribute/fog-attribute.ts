// GENERATED
import { make, NgtInstance, provideInstanceRef, NgtFog } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import type { Subscription } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-fog[fog]',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideInstanceRef(NgtFogAttribute)],
})
export class NgtFogAttribute extends NgtInstance<THREE.Fog> {
  @Input() set fog(fog: NgtFog) {
    this.zone.runOutsideAngular(() => {
      if (this.initSubscription) {
        this.initSubscription.unsubscribe();
      }

      this.initSubscription = this.onCanvasReady(
        this.store.ready$,
        () => {
          this.prepareInstance(make(THREE.Fog, fog));
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
  imports: [NgtFogAttribute],
  exports: [NgtFogAttribute],
})
export class NgtFogAttributeModule {}
