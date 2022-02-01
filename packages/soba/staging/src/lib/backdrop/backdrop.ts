import {
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtExtender,
  NgtMathPipeModule,
  NgtObjectInputsController,
  NgtObjectInputsControllerModule,
  NgtRadianPipeModule,
  NgtStore,
  zonelessRequestAnimationFrame,
} from '@angular-three/core';
import { NgtPlaneGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtMeshModule } from '@angular-three/core/meshes';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgModule,
} from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import * as THREE from 'three';

interface NgtSobaBackdropState {
  plane: THREE.PlaneGeometry;
  floor: number;
  segments: number;
  receiveShadow: boolean;
}

const easeInExpo = (x: number) => (x === 0 ? 0 : Math.pow(2, 10 * x - 10));

@Component({
  selector: 'ngt-soba-backdrop',
  template: `
    <ngt-group [objectInputsController]="objectInputsController">
      <ngt-mesh
        (ready)="object = $event"
        [receiveShadow]="store.get('receiveShadow')"
        [rotation]="[-90 | radian, 0, 90 | radian]"
      >
        <ngt-plane-geometry
          (ready)="store.set({ plane: $event })"
          [args]="[1, 1, store.get('segments'), store.get('segments')]"
        ></ngt-plane-geometry>
        <ng-content></ng-content>
      </ngt-mesh>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    { provide: NgtExtender, useExisting: NgtSobaBackdrop },
    NgtStore,
  ],
})
export class NgtSobaBackdrop extends NgtExtender<THREE.Mesh> {
  @Input() set floor(floor: number) {
    this.store.set({ floor });
  }

  @Input() set segments(segments: number) {
    this.store.set({ segments });
  }

  @Input() set receiveShadow(receiveShadow: boolean) {
    this.store.set({ receiveShadow });
  }

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObjectInputsController,
    public store: NgtStore<NgtSobaBackdropState>
  ) {
    super();
    store.set({
      receiveShadow: false,
      floor: 0.25,
      segments: 20,
    });
  }

  ngOnInit() {
    zonelessRequestAnimationFrame(() => {
      this.store.hold(
        this.store.select(selectSlice(['floor', 'segments'])),
        ({ floor, segments }) => {
          const plane = this.store.get('plane');
          let i = 0;
          const offset = segments / segments / 2;
          const position = plane.attributes['position'];
          for (let x = 0; x < segments + 1; x++) {
            for (let y = 0; y < segments + 1; y++) {
              position.setXYZ(
                i++,
                x / segments - offset + (x === 0 ? -floor : 0),
                y / segments - offset,
                easeInExpo(x / segments)
              );
            }
          }
          position.needsUpdate = true;
          plane.computeVertexNormals();
        }
      );
    });
  }
}

@NgModule({
  declarations: [NgtSobaBackdrop],
  exports: [NgtSobaBackdrop, NgtObjectInputsControllerModule],
  imports: [
    NgtGroupModule,
    NgtMeshModule,
    NgtPlaneGeometryModule,
    NgtMathPipeModule,
    NgtRadianPipeModule,
  ],
})
export class NgtSobaBackdropModule {}
