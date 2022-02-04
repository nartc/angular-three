import {
  NGT_OBJECT_INPUTS_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NgtAnimationFrameStore,
  NgtCanvasStore,
  NgtColorPipeModule,
  NgtExtender,
  NgtObjectInputsController,
  NgtObjectInputsControllerModule,
  NgtStore,
  NgtVectorPipeModule,
  zonelessRequestAnimationFrame,
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
import { selectSlice } from '@rx-angular/state';
import * as THREE from 'three';
import { ColorRepresentation } from 'three/src/utils';
import {
  NgtSobaSpotLightMaterialModule,
  SpotLightMaterial,
} from './spot-light-material';

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
  hasRadiusTop: boolean;
  radiusBottom: number;
  hasRadiusBottom: boolean;
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
      *ngIf="store.get('geometry')"
      (ready)="object = $event; store.set({ light: $event })"
      (animateReady)="
        animateReady.emit({ entity: object, state: $event.state })
      "
      [objectInputsController]="objectInputsController"
      [args]="[
        store.get('color'),
        store.get('intensity'),
        store.get('distance'),
        store.get('angle'),
        store.get('penumbra'),
        store.get('decay')
      ]"
    >
      <ngt-mesh
        (ready)="store.set({ mesh: $event })"
        [geometry]="store.get('geometry')"
        [raycast]="null"
      >
        <ngt-soba-spot-light-material
          (ready)="store.set({ material: $event })"
          [parameters]="{
            uniforms: {
              opacity: { value: store.get('opacity') },
              lightColor: { value: store.get('color') | color },
              attenuation: { value: store.get('attenuation') },
              anglePower: { value: store.get('anglePower') },
              depth: { value: store.get('depthBuffer') },
              cameraNear: { value: canvasStore.get('camera', 'near') },
              cameraFar: { value: canvasStore.get('camera', 'far') },
              resolution: {
                value:
                  (store.get('depthBuffer')
                    ? [
                        canvasStore.get('size', 'width') *
                          canvasStore.get('viewport', 'dpr'),
                        canvasStore.get('size', 'height') *
                          canvasStore.get('viewport', 'dpr')
                      ]
                    : [0, 0]
                  ) | vector2
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
    { provide: NgtExtender, useExisting: NgtSobaSpotLight },
    NgtStore,
  ],
})
export class NgtSobaSpotLight extends NgtExtender<THREE.SpotLight> {
  @Input() set color(color: ColorRepresentation) {
    this.store.set({ color });
  }

  @Input() set intensity(intensity: number) {
    this.store.set({ intensity });
  }

  @Input() set distance(distance: number) {
    this.store.set({ distance });
  }

  @Input() set angle(angle: number) {
    this.store.set({ angle });
  }

  @Input() set penumbra(penumbra: number) {
    this.store.set({ penumbra });
  }

  @Input() set decay(decay: number) {
    this.store.set({ decay });
  }

  @Input() set depthBuffer(depthBuffer: THREE.DepthTexture) {
    this.store.set({ depthBuffer });
  }

  @Input() set attenuation(attenuation: number) {
    this.store.set({ attenuation });
  }

  @Input() set anglePower(anglePower: number) {
    this.store.set({ anglePower });
  }

  @Input() set radiusTop(radiusTop: number) {
    this.store.set({ radiusTop, hasRadiusTop: true });
  }

  @Input() set radiusBottom(radiusBottom: number) {
    this.store.set({ radiusBottom, hasRadiusBottom: true });
  }

  @Input() set opacity(opacity: number) {
    this.store.set({ opacity });
  }

  constructor(
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    public objectInputsController: NgtObjectInputsController,
    public store: NgtStore<NgtSobaSpotLightState>,
    public canvasStore: NgtCanvasStore,
    private animationFrameStore: NgtAnimationFrameStore
  ) {
    super();
    store.set({
      opacity: 1,
      radiusTop: 0.1,
      hasRadiusTop: false,
      radiusBottom: 0.15 * 7,
      hasRadiusBottom: false,
      color: 'white',
      distance: 5,
      angle: 0.15,
      attenuation: 5,
      anglePower: 5,
    });
  }

  ngOnInit() {
    this.store.connect(
      'geometry',
      this.store.select(
        selectSlice([
          'angle',
          'distance',
          'radiusTop',
          'radiusBottom',
          'hasRadiusBottom',
          'hasRadiusTop',
        ])
      ),
      (
        _,
        {
          radiusBottom,
          radiusTop,
          distance,
          hasRadiusBottom,
          hasRadiusTop,
          angle,
        }
      ) => {
        const geometry = new THREE.CylinderGeometry(
          hasRadiusTop ? radiusTop : 0.1,
          hasRadiusBottom ? radiusBottom : angle * 7,
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

    zonelessRequestAnimationFrame(() => {
      this.store.effect(this.canvasStore.ready$, () => {
        const animationUuid = this.animationFrameStore.register({
          callback: () => {
            const { material, mesh } = this.store.get();
            if (material && mesh) {
              material.uniforms['spotPosition'].value.copy(
                mesh.getWorldPosition(vec)
              );
              if ((mesh.parent as THREE.SpotLight)?.target) {
                mesh.lookAt(
                  (mesh.parent as THREE.SpotLight).target.getWorldPosition(vec)
                );
              }
            }
          },
        });

        return () => {
          this.animationFrameStore.actions.unregister(animationUuid);
        };
      });
    });
  }
}

@NgModule({
  declarations: [NgtSobaSpotLight],
  exports: [NgtSobaSpotLight, NgtObjectInputsControllerModule],
  imports: [
    NgtSpotLightModule,
    NgtMeshModule,
    NgtSobaSpotLightMaterialModule,
    CommonModule,
    NgtColorPipeModule,
    NgtVectorPipeModule,
  ],
})
export class NgtSobaSpotLightModule {}
