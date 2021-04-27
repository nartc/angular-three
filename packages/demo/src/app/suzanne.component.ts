import { AnimationReady } from '@angular-three/core';
import { loadBufferGeometry } from '@angular-three/core/loaders';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InstancedMesh, Object3D } from 'three';

@Component({
  selector: 'demo-suzanne',
  template: `
    <ngt-instanced-mesh
      [geometry]="geometry$ | async"
      [args]="[1000]"
      (animateReady)="onReady($event)"
    >
      <ngt-mesh-normal-material></ngt-mesh-normal-material>
    </ngt-instanced-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuzanneComponent {
  geometry$ = loadBufferGeometry('/assets/model.json', (geometry) => {
    geometry.computeVertexNormals();
    geometry.scale(0.5, 0.5, 0.5);
  });

  private dummy = new Object3D();

  onReady({
    animateObject,
    renderState: { clock },
  }: AnimationReady<InstancedMesh>) {
    if (animateObject) {
      const time = clock.getElapsedTime();

      animateObject.rotation.x = Math.sin(time / 4);
      animateObject.rotation.y = Math.sin(time / 2);

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

            animateObject.setMatrixAt(i++, this.dummy.matrix);
          }
        }
      }
      animateObject.instanceMatrix.needsUpdate = true;
    }
  }
}
