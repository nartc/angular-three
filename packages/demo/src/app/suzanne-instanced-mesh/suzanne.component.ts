import { AnimationReady, LoaderService } from '@angular-three/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BufferGeometryLoader, InstancedMesh, Object3D } from 'three';

@Component({
  selector: 'demo-suzanne',
  template: `
    <ngt-instanced-mesh
      o3d
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
  geometry$ = this.loaderService
    .use(BufferGeometryLoader, '/assets/model.json')
    .pipe(
      tap((geometry) => {
        geometry.computeVertexNormals();
        geometry.scale(0.5, 0.5, 0.5);
      })
    );

  private dummy = new Object3D();

  constructor(private readonly loaderService: LoaderService) {}

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
