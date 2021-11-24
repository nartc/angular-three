import {
  CanvasStore,
  DestroyedService,
  NgtCoreModule,
  NgtCurrentViewport,
  NgtRepeatModule,
} from '@angular-three/core';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-bananas',
  template: `
    <ngt-canvas>
      <ngt-stats></ngt-stats>
      <ngt-box *repeat="let index of count" [z]="-index"></ngt-box>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BananasComponent {
  count = 100;
}

@Component({
  selector: 'ngt-box',
  template: `
    <ngt-mesh (animateReady)="onBoxAnimate($event.animateObject)">
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-basic-material
        [parameters]="{ color: 'orange' }"
      ></ngt-mesh-basic-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyedService],
})
export class BoxComponent {
  @Input() z = 0;

  x = THREE.MathUtils.randFloatSpread(2);
  y = 0;

  private calculatedViewport!: NgtCurrentViewport;

  constructor(private canvasStore: CanvasStore) {}

  ngOnInit() {
    const {
      internal: { viewport },
      camera,
    } = this.canvasStore.getImperativeState();
    this.calculatedViewport = viewport.getCurrentViewport(
      camera,
      new THREE.Vector3(0, 0, this.z)
    );

    this.y = THREE.MathUtils.randFloatSpread(this.calculatedViewport.height);
  }

  onBoxAnimate(mesh: THREE.Mesh) {
    const { width, height } = this.calculatedViewport;
    mesh.position.set(this.x * width, (this.y += 0.5), this.z);
    if (this.y > height / 1.5) {
      this.y = -height / 1.5;
    }
  }
}

@NgModule({
  declarations: [BananasComponent, BoxComponent],
  exports: [BananasComponent, BoxComponent],
  imports: [
    NgtCoreModule,
    NgtMeshModule,
    NgtBoxGeometryModule,
    NgtMeshBasicMaterialModule,
    NgtRepeatModule,
    NgtStatsModule,
  ],
})
export class BananasComponentModule {}
