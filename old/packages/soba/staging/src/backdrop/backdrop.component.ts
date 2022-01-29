import {
  EnhancedRxState,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtMathPipeModule,
  NgtObject3dInputsController,
  NgtObject3dInputsControllerModule,
  NgtSobaExtender,
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
import { requestAnimationFrame } from '@rx-angular/cdk/zone-less';
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
    <ngt-group [object3dInputsController]="objectInputsController">
      <ngt-mesh
        (ready)="object = $event"
        [receiveShadow]="state.get('receiveShadow')"
        [rotation]="[-0.5 | mathConst: 'PI', 0, 0.5 | mathConst: 'PI']"
      >
        <ngt-plane-geometry
          (ready)="state.set({ plane: $event })"
          [args]="[1, 1, state.get('segments'), state.get('segments')]"
        ></ngt-plane-geometry>
        <ng-content></ng-content>
      </ngt-mesh>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    { provide: NgtSobaExtender, useExisting: NgtSobaBackdrop },
    EnhancedRxState,
  ],
})
export class NgtSobaBackdrop extends NgtSobaExtender<THREE.Mesh> {
  @Input() set floor(floor: number) {
    this.state.set({ floor });
  }

  @Input() set segments(segments: number) {
    this.state.set({ segments });
  }

  @Input() set receiveShadow(receiveShadow: boolean) {
    this.state.set({ receiveShadow });
  }

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObject3dInputsController,
    public state: EnhancedRxState<NgtSobaBackdropState>
  ) {
    super();
    state.set({
      receiveShadow: false,
      floor: 0.25,
      segments: 20,
    });

    requestAnimationFrame(() => {
      state.hold(
        state.select(selectSlice(['floor', 'segments'])),
        ({ floor, segments }) => {
          const plane = state.get('plane');
          let i = 0;
          const offset = segments / segments / 2;
          const position = plane.attributes.position;
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
  exports: [NgtSobaBackdrop, NgtObject3dInputsControllerModule],
  imports: [
    NgtGroupModule,
    NgtMeshModule,
    NgtPlaneGeometryModule,
    NgtMathPipeModule,
  ],
})
export class NgtSobaBackdropModule {}
