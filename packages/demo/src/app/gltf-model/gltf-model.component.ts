import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoaderService } from '@angular-three/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

@Component({
  selector: 'demo-gltf-model',
  template: `
    <ngt-canvas
      [camera]="{ position: [1, 1, 2000], fov: 50, near: 0.1, far: 10000 }"
      (created)="$event.gl.setClearColor('grey')"
    >
      <ngt-orbit-controls></ngt-orbit-controls>

      <ngt-ambient-light o3d [args]="['#ffffff']"></ngt-ambient-light>

      <ngt-directional-light
        o3d
        [args]="['#ffffff', 0.8 * (1 | mathConst: 'PI')]"
      ></ngt-directional-light>

      <ng-container *ngIf="model$ | async as model">
        <ngt-primitive o3d [object]="model.scene"></ngt-primitive>
      </ng-container>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GltfModelComponent {
  model$ = this.loaderService.use(GLTFLoader, './assets/locdo.gltf');

  constructor(private readonly loaderService: LoaderService) {}
}
