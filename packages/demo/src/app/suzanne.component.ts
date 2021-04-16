import { AnimationStore } from '@angular-three/core';
import { loadBufferGeometry } from '@angular-three/core/loaders';
import { InstancedMeshDirective } from '@angular-three/core/meshes';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from '@angular/core';
import { Object3D } from 'three';

@Component({
  selector: 'demo-suzanne',
  template: `
    <ngt-instancedMesh [geometry]="geometry$ | async" [args]="[1000]">
      <ngt-meshNormalMaterial></ngt-meshNormalMaterial>
    </ngt-instancedMesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuzanneComponent implements AfterViewInit {
  geometry$ = loadBufferGeometry('/assets/model.json', (geometry) => {
    geometry.computeVertexNormals();
    geometry.scale(0.5, 0.5, 0.5);
  });

  @ViewChild(InstancedMeshDirective) instancedMesh!: InstancedMeshDirective;

  private dummy = new Object3D();

  constructor(private readonly animationStore: AnimationStore) {}

  ngAfterViewInit() {
    this.animationStore.registerAnimation(
      this.instancedMesh.object3d$,
      (mesh, { clock }) => {
        if (mesh) {
          const time = clock.getElapsedTime();

          mesh.rotation.x = Math.sin(time / 4);
          mesh.rotation.y = Math.sin(time / 2);

          let i = 0;
          for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
              for (let z = 0; z < 10; z++) {
                this.dummy.position.set(5 - x, 5 - y, 5 - z);
                this.dummy.rotation.y =
                  Math.sin(x / 4 + time) +
                  Math.sin(y / 4 + time) +
                  Math.sin(z / 4 + time);
                this.dummy.rotation.z = this.dummy.rotation.y * 2;

                this.dummy.updateMatrix();

                mesh.setMatrixAt(i++, this.dummy.matrix);
              }
            }
          }
          mesh.instanceMatrix.needsUpdate = true;
        }
      }
    );
  }
}
