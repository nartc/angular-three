import {
  coerceNumberProperty,
  make,
  NgtObjectPassThrough,
  NumberInput,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
  Ref,
  tapEffect,
} from '@angular-three/core';
import { NgtSpotLight, NgtSpotLightPassThrough } from '@angular-three/core/lights';
import { NgtMesh } from '@angular-three/core/meshes';
import { SpotLightMaterial } from '@angular-three/soba/materials';
import { NgtSobaSpotLightMaterial } from '@angular-three/soba/shaders';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

const vec = new THREE.Vector3();

@Component({
  selector: 'ngt-soba-spot-light',
  standalone: true,
  template: `
    <ngt-spot-light
      [ngtObjectPassThrough]="this"
      [ngtSpotLightPassThrough]="this"
      [angle]="lightAngle"
      [color]="color"
      [distance]="lightDistance"
    >
      <ngt-mesh [ref]="meshRef" [raycast]="meshRaycast" [geometry]="(geometry$ | async)!">
        <ngt-soba-spot-light-material
          [ref]="materialRef"
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
  imports: [NgtSpotLight, NgtObjectPassThrough, NgtSpotLightPassThrough, NgtMesh, NgtSobaSpotLightMaterial, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtObject(NgtSobaSpotLight),
    provideObjectRef(NgtSobaSpotLight),
    provideObjectHostRef(NgtSobaSpotLight),
  ],
})
export class NgtSobaSpotLight extends NgtSpotLight {
  readonly meshRef = new Ref<THREE.Mesh>();
  readonly materialRef = new Ref<SpotLightMaterial>();

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
        color: state['color'] ?? make(THREE.Color, 'white'),
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
      this.store.onReady(() => {
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
    tapEffect(() =>
      this.store.registerBeforeRender({
        callback: () => {
          if (this.materialRef.value && this.meshRef.value) {
            this.materialRef.value.uniforms['spotPosition'].value.copy(this.meshRef.value.getWorldPosition(vec));
            if (this.meshRef.value.parent) {
              this.meshRef.value.lookAt((this.meshRef.value.parent as THREE.SpotLight).target.getWorldPosition(vec));
            }
          }
        },
      })
    )
  );
}

@NgModule({
  imports: [NgtSobaSpotLight],
  exports: [NgtSobaSpotLight],
})
export class NgtSobaSpotLightModule {}
