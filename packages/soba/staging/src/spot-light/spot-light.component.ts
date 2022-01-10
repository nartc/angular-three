import {
  EnhancedRxState,
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtAnimationFrameStore,
  NgtColorPipeModule,
  NgtObject3dInputsController,
  NgtObject3dInputsControllerModule,
  NgtSobaExtender,
  NgtStore,
} from '@angular-three/core';
import { NgtSpotLightModule } from '@angular-three/core/lights';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { CommonModule } from '@angular/common';
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
import { ColorRepresentation } from 'three/src/utils';
import {
  NgtSobaSpotLightMaterialModule,
  SpotLightMaterial,
} from './spot-light-material.directive';

interface NgtSobaSpotLightState {
  color: ColorRepresentation;
  intensity: number;
  distance: number;
  angle: number;
  penumbra: number;
  decay: number;
  depthBuffer: THREE.DepthTexture | null;
  attenuation: number;
  anglePower: number;
  radiusTop: number;
  radiusBottom: number;
  opacity: number;
  light: THREE.SpotLight;
  mesh: THREE.Mesh;
  geometry: THREE.CylinderGeometry;
  material: SpotLightMaterial;
}

const vec = new THREE.Vector3();

@Component({
  selector: 'ngt-soba-spot-light',
  template: `
    <ngt-spot-light
      *ngIf="state.get('geometry')"
      (ready)="object = $event; state.set({ light: $event })"
      (animateReady)="animateReady.emit({ entity: object, state: $event })"
      [object3dInputsController]="objectInputsController"
      [args]="[
        state.get('color'),
        state.get('intensity'),
        state.get('distance'),
        state.get('angle'),
        state.get('penumbra'),
        state.get('decay')
      ]"
    >
      <ngt-mesh
        (ready)="state.set({ mesh: $event })"
        [geometry]="state.get('geometry')"
        [raycast]="null"
      >
        <ngt-soba-spot-light-material
          (ready)="state.set({ material: $event })"
          [parameters]="{
            uniforms: {
              opacity: { value: state.get('opacity') },
              lightColor: { value: state.get('color') | color },
              attenuation: { value: state.get('attenuation') },
              anglePower: { value: state.get('anglePower') },
              depth: { value: state.get('depthBuffer') },
              cameraNear: { value: store.get('camera', 'near') },
              cameraFar: { value: store.get('camera', 'far') },
              resolution: {
                value: state.get('depthBuffer')
                  ? [
                      store.get('size', 'width') * store.get('viewport', 'dpr'),
                      store.get('size', 'height') * store.get('viewport', 'dpr')
                    ]
                  : [0, 0]
              }
            }
          }"
        ></ngt-soba-spot-light-material>
      </ngt-mesh>
    </ngt-spot-light>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
    { provide: NgtSobaExtender, useExisting: NgtSobaSpotLight },
    EnhancedRxState,
  ],
})
export class NgtSobaSpotLight extends NgtSobaExtender<THREE.SpotLight> {
  @Input() set color(color: ColorRepresentation) {
    this.state.set({ color });
  }

  @Input() set intensity(intensity: number) {
    this.state.set({ intensity });
  }

  @Input() set distance(distance: number) {
    this.state.set({ distance });
  }

  @Input() set angle(angle: number) {
    this.state.set({ angle });
  }

  @Input() set penumbra(penumbra: number) {
    this.state.set({ penumbra });
  }

  @Input() set decay(decay: number) {
    this.state.set({ decay });
  }

  @Input() set depthBuffer(depthBuffer: THREE.DepthTexture) {
    this.state.set({ depthBuffer });
  }

  @Input() set attenuation(attenuation: number) {
    this.state.set({ attenuation });
  }

  @Input() set anglePower(anglePower: number) {
    this.state.set({ anglePower });
  }

  @Input() set radiusTop(radiusTop: number) {
    this.state.set({ radiusTop });
  }

  @Input() set radiusBottom(radiusBottom: number) {
    this.state.set({ radiusBottom });
  }

  @Input() set opacity(opacity: number) {
    this.state.set({ opacity });
  }

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObject3dInputsController,
    public state: EnhancedRxState<NgtSobaSpotLightState>,
    public store: NgtStore,
    animationFrameStore: NgtAnimationFrameStore
  ) {
    super();
    state.set({
      opacity: 1,
      radiusTop: 0.1,
      radiusBottom: 0.15 * 7,
      color: 'white',
      distance: 5,
      angle: 0.15,
      attenuation: 5,
      anglePower: 5,
    });

    state.connect(
      'geometry',
      state.select(
        selectSlice(['angle', 'distance', 'radiusTop', 'radiusBottom'])
      ),
      (_, { radiusBottom, radiusTop, distance }) => {
        const geometry = new THREE.CylinderGeometry(
          radiusTop,
          radiusBottom,
          distance,
          128,
          64,
          true
        );
        geometry.applyMatrix4(
          new THREE.Matrix4().makeTranslation(0, -distance / 2, 0)
        );
        geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
        return geometry;
      }
    );

    requestAnimationFrame(() => {
      state.holdEffect(store.select('ready'), (ready) => {
        if (ready) {
          const animationUuid = animationFrameStore.register({
            callback: () => {
              const { material, mesh } = state.get();
              if (material && mesh) {
                material.uniforms.spotPosition.value.copy(
                  mesh.getWorldPosition(vec)
                );
                mesh.lookAt(
                  (mesh.parent as THREE.SpotLight).target.getWorldPosition(vec)
                );
              }
            },
          });

          return () => {
            animationFrameStore.actions.unsubscriberUuid(animationUuid);
          };
        }
        return;
      });
    });
  }
}

@NgModule({
  declarations: [NgtSobaSpotLight],
  exports: [NgtSobaSpotLight, NgtObject3dInputsControllerModule],
  imports: [
    NgtSpotLightModule,
    NgtMeshModule,
    NgtSobaSpotLightMaterialModule,
    CommonModule,
    NgtColorPipeModule,
  ],
})
export class NgtSobaSpotLightModule {}
