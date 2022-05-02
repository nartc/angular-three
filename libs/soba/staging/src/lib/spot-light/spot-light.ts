import {
  coerceNumberProperty,
  makeColor,
  NgtObjectPassThroughModule,
  NumberInput,
  provideObjectHostRef,
  tapEffect,
} from '@angular-three/core';
import { NgtSpotLight, NgtSpotLightModule, NgtSpotLightPassThroughModule } from '@angular-three/core/lights';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three';
import { NgtSobaSpotLightMaterialModule } from './spot-light-material';

const vec = new THREE.Vector3();

@Component({
  selector: 'ngt-soba-spot-light',
  template: `
    <ngt-spot-light
      [ngtObjectInputs]="this"
      [ngtObjectOutputs]="this"
      [ngtSpotLightPassThrough]="this"
      [angle]="lightAngle"
      [color]="color"
      [distance]="lightDistance"
    >
      <ngt-mesh (ready)="set({ mesh: $event })" [raycast]="meshRaycast" [geometry]="(geometry$ | async)!">
        <ngt-soba-spot-light-material
          (ready)="set({ material: $event })"
          [uniforms]="{
            opacity: { value: opacity },
            lightColor: { value: color },
            attenuation: { value: attenuation },
            anglePower: { value: anglePower },
            depth: { value: depthBuffer },
            cameraNear: { value: cameraNear },
            cameraFar: { value: cameraFar },
            resolution: {
              value: depthBuffer ? [size.width * dpr, size.height * dpr] : [0, 0]
            }
          }"
        ></ngt-soba-spot-light-material>
      </ngt-mesh>
    </ngt-spot-light>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideObjectHostRef(NgtSobaSpotLight)],
})
export class NgtSobaSpotLight extends NgtSpotLight {
  @Input() set depthBuffer(depthBuffer: THREE.DepthTexture) {
    this.set({ depthBuffer });
  }

  get depthBuffer() {
    return this.get((s) => s['depthBuffer']) ?? null;
  }

  @Input() set attenuation(attenuation: NumberInput) {
    this.set({ attenuation: coerceNumberProperty(attenuation) });
  }

  get attenuation() {
    return this.get((s) => s['attenuation']);
  }

  @Input() set anglePower(anglePower: NumberInput) {
    this.set({ anglePower: coerceNumberProperty(anglePower) });
  }

  get anglePower() {
    return this.get((s) => s['anglePower']);
  }

  @Input() set radiusTop(radiusTop: NumberInput) {
    this.set({ radiusTop: coerceNumberProperty(radiusTop) });
  }

  @Input() set radiusBottom(radiusBottom: NumberInput) {
    this.set({ radiusBottom: coerceNumberProperty(radiusBottom) });
  }

  @Input() set opacity(opacity: NumberInput) {
    this.set({ opacity: coerceNumberProperty(opacity) });
  }

  get opacity() {
    return this.get((s) => s['opacity']);
  }

  get lightAngle() {
    return this.get((s) => s['angle']);
  }

  get lightDistance() {
    return this.get((s) => s['distance']);
  }

  get cameraNear() {
    return this.store.get((s) => s.camera.near);
  }

  get cameraFar() {
    return this.store.get((s) => s.camera.far);
  }

  get size() {
    return this.store.get((s) => s.size);
  }

  get dpr() {
    return this.store.get((s) => s.viewport.dpr);
  }

  readonly meshRaycast = () => null;

  override shouldPassThroughRef = false;

  readonly geometry$ = this.select(
    this.select((s) => s['angle']),
    this.select((s) => s['distance']),
    this.select((s) => s['radiusTop']),
    this.select((s) => s['radiusBottom']),
    (angle, distance, radiusTop, radiusBottom) => {
      const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, distance, 128, 64, true);
      geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -distance / 2, 0));
      geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
      return geometry;
    }
  );

  protected override preInit() {
    super.preInit();
    this.set((state) => {
      const angle = state['angle'] ?? 0.15;
      const radiusBottomExplicit = !!state['radiusBottom'];
      return {
        opacity: state['opacity'] ?? 1,
        color: state['color'] ?? makeColor('white'),
        distance: state['distance'] ?? 5,
        angle,
        attenuation: state['attenuation'] ?? 5,
        anglePower: state['anglePower'] ?? 5,
        radiusTop: state['radiusTop'] ?? 0.1,
        radiusBottom: state['radiusBottom'] ?? angle * 7,
        radiusBottomExplicit,
      };
    });
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(this.store.ready$, () => {
        this.set(
          this.select(
            this.select((s) => s['angle']),
            (angle) => {
              const radiusBottomExplicit = this.get((s) => s['radiusBottomExplicit']);
              const radiusBottom = this.get((s) => s['radiusBottom']);
              return {
                radiusBottom: radiusBottomExplicit ? radiusBottom : angle * 7,
              };
            }
          )
        );

        this.setBeforeRender();
      });
    });
  }

  private readonly setBeforeRender = this.effect<void>(
    tapEffect(() => {
      const unregister = this.store.registerBeforeRender({
        callback: () => {
          const { material, mesh } = this.get();
          if (material && mesh) {
            material.uniforms.spotPosition.value.copy(mesh.getWorldPosition(vec));
            if (mesh.parent) {
              mesh.lookAt(mesh.parent.target.getWorldPosition(vec));
            }
          }
        },
      });

      return () => {
        unregister();
      };
    })
  );
}

@NgModule({
  declarations: [NgtSobaSpotLight],
  exports: [NgtSobaSpotLight],
  imports: [
    NgtSpotLightModule,
    NgtObjectPassThroughModule,
    NgtMeshModule,
    NgtSobaSpotLightMaterialModule,
    CommonModule,
    NgtSpotLightPassThroughModule,
  ],
})
export class NgtSobaSpotLightModule {}
