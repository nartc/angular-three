import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  is,
  make,
  NgtObjectPassThrough,
  NgtRadianPipe,
  NgtRef,
  NumberInput,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
} from '@angular-three/core';
import { NgtOrthographicCamera } from '@angular-three/core/cameras';
import { NgtMeshBasicMaterial } from '@angular-three/core/materials';
import { NgtGroup, NgtMesh } from '@angular-three/core/objects';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
import { HorizontalBlurShader, VerticalBlurShader } from 'three-stdlib';

@Component({
  selector: 'ngt-soba-contact-shadows',
  standalone: true,
  template: `
    <ngt-group
      [ngtObjectPassThrough]="this"
      [rotation]="[90 | radian, 0, 0]"
      (beforeRender)="onBeforeRender($event.object)"
      name="soba-contact-shadows"
    >
      <ng-container *ngIf="shadowViewModel$ | async as viewModel">
        <ngt-mesh
          [geometry]="viewModel.planeGeometry"
          [scale]="[1, -1, 1]"
          [rotation]="[-90 | radian, 0, 0]"
        >
          <ngt-mesh-basic-material
            [map]="viewModel.renderTarget.texture"
            transparent
            [opacity]="viewModel.opacity"
            [depthWrite]="viewModel.depthWrite"
          ></ngt-mesh-basic-material>
        </ngt-mesh>

        <ngt-orthographic-camera
          [ref]="shadowCameraRef"
          [args]="[
            -viewModel.width / 2,
            viewModel.width / 2,
            viewModel.height / 2,
            -viewModel.height / 2,
            0,
            viewModel.far
          ]"
        ></ngt-orthographic-camera>
      </ng-container>
    </ngt-group>
  `,
  imports: [
    NgtGroup,
    NgtObjectPassThrough,
    NgtRadianPipe,
    NgIf,
    AsyncPipe,
    NgtMesh,
    NgtMeshBasicMaterial,
    NgtOrthographicCamera,
  ],
  providers: [
    provideNgtObject(NgtSobaContactShadows),
    provideObjectRef(NgtSobaContactShadows),
    provideObjectHostRef(NgtSobaContactShadows),
  ],
})
export class NgtSobaContactShadows extends NgtGroup {
  override isWrapper = true;
  override shouldPassThroughRef = true;

  @Input() set opacity(opacity: NumberInput) {
    this.set({ opacity: coerceNumberProperty(opacity) });
  }
  get opacity() {
    return this.get((s) => s['opacity']);
  }

  @Input() set width(width: NumberInput) {
    this.set({ width: coerceNumberProperty(width) });
  }

  get width() {
    return this.get((s) => s['scaledWidth']);
  }
  @Input() set height(height: NumberInput) {
    this.set({ height: coerceNumberProperty(height) });
  }

  get height() {
    return this.get((s) => s['scaledHeight']);
  }
  @Input() set blur(blur: NumberInput) {
    this.set({ blur: coerceNumberProperty(blur) });
  }

  @Input() set far(far: NumberInput) {
    this.set({ far: coerceNumberProperty(far) });
  }

  get far() {
    return this.get((s) => s['far']);
  }

  @Input() set smooth(smooth: BooleanInput) {
    this.set({ smooth: coerceBooleanProperty(smooth) });
  }

  @Input() set resolution(resolution: NumberInput) {
    this.set({ resolution: coerceNumberProperty(resolution) });
  }

  @Input() set frames(frames: NumberInput) {
    this.set({ frames: coerceNumberProperty(frames) });
  }

  @Input() set depthWrite(depthWrite: BooleanInput) {
    this.set({ depthWrite: coerceBooleanProperty(depthWrite) });
  }
  get depthWrite() {
    return this.get((s) => s['depthWrite']);
  }

  #count = 1;

  readonly shadowViewModel$ = this.select(
    this.select((s) => s.priority),
    this.select((s) => s['planeGeometry']),
    this.select((s) => s['renderTarget']),
    this.select((s) => s['opacity']),
    this.select((s) => s['depthWrite']),
    this.select((s) => s['scaledWidth']),
    this.select((s) => s['scaledHeight']),
    this.select((s) => s['far']),
    (
      priority,
      planeGeometry,
      renderTarget,
      opacity,
      depthWrite,
      width,
      height,
      far
    ) => ({
      priority,
      planeGeometry,
      renderTarget,
      opacity,
      depthWrite,
      width,
      height,
      far,
    }),
    { debounce: true }
  );

  get shadowCameraRef() {
    return this.get((s) => s['shadowCameraRef']);
  }

  readonly #setShadows = this.effect(
    tap(() => {
      const {
        resolution,
        scaledWidth: width,
        scaledHeight: height,
        color,
      } = this.get();
      const gl = this.store.get((s) => s.gl);

      const renderTarget = new THREE.WebGLRenderTarget(resolution, resolution);
      renderTarget.texture.encoding = gl.outputEncoding;

      const renderTargetBlur = new THREE.WebGLRenderTarget(
        resolution,
        resolution
      );
      renderTargetBlur.texture.generateMipmaps =
        renderTarget.texture.generateMipmaps = false;

      const planeGeometry = new THREE.PlaneGeometry(width, height).rotateX(
        Math.PI / 2
      );
      const blurPlane = new THREE.Mesh(planeGeometry);
      const depthMaterial = new THREE.MeshDepthMaterial();
      depthMaterial.depthTest = depthMaterial.depthWrite = false;
      depthMaterial.onBeforeCompile = (shader) => {
        shader.uniforms = {
          ...shader.uniforms,
          ucolor: {
            value: new THREE.Color(color).convertSRGBToLinear(),
          },
        };
        shader.fragmentShader = shader.fragmentShader.replace(
          `void main() {`, //
          `uniform vec3 ucolor;
           void main() {
          `
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          'vec4( vec3( 1.0 - fragCoordZ ), opacity );',
          'vec4( ucolor, ( 1.0 - fragCoordZ ) * 1.0 );'
        );
      };

      const horizontalBlurMaterial = new THREE.ShaderMaterial(
        HorizontalBlurShader
      );
      const verticalBlurMaterial = new THREE.ShaderMaterial(VerticalBlurShader);
      verticalBlurMaterial.depthTest = horizontalBlurMaterial.depthTest = false;

      this.zone.run(() => {
        this.set({
          renderTarget,
          planeGeometry,
          depthMaterial,
          blurPlane,
          horizontalBlurMaterial,
          verticalBlurMaterial,
          renderTargetBlur,
        });
      });
    })
  );

  override preInit() {
    super.preInit();
    this.set((s) => {
      return {
        shadowCameraRef: new NgtRef(),
        scale: is.equ(s.scale.toArray(), make(THREE.Vector3, 1).toArray())
          ? make(THREE.Vector3, 10)
          : s.scale,
        frames: s['frames'] ?? Infinity,
        opacity: s['opacity'] ?? 1,
        width: s['width'] ?? 1,
        height: s['height'] ?? 1,
        blur: s['blur'] ?? 1,
        far: s['far'] ?? 10,
        resolution: s['resolution'] ?? 512,
        smooth: s['smooth'] ?? true,
        color: is.equ(s.color.toArray(), make(THREE.Color).toArray())
          ? make(THREE.Color, '#000000')
          : s.color,
        depthWrite: s['depthWrite'] ?? false,
      };
    });

    this.set(
      this.select(
        this.select((s) => s['width']),
        this.select((s) => s['height']),
        this.select((s) => s.scale),
        (width, height, scale) => {
          return {
            scaledWidth: width * scale.x,
            scaledHeight: height * scale.y,
          };
        }
      )
    );
  }

  protected override postInit() {
    super.postInit();
    this.#setShadows(
      this.select(
        this.select((s) => s['resolution']),
        this.select((s) => s['scaledWidth']),
        this.select((s) => s['scaledHeight']),
        this.select((s) => s.scale),
        this.select((s) => s.color)
      )
    );
  }

  onBeforeRender(group: THREE.Group) {
    group.scale.setScalar(1);
    const {
      shadowCameraRef,
      frames,
      depthMaterial,
      renderTarget,
      smooth,
      blur,
    } = this.get();
    const gl = this.store.get((s) => s.gl);
    const scene = this.store.get((s) => s.scene);

    if (
      shadowCameraRef.value &&
      renderTarget &&
      (frames === Infinity || this.#count < frames)
    ) {
      const initialBackground = scene.background;
      scene.background = null;
      const initialOverrideMaterial = scene.overrideMaterial;
      scene.overrideMaterial = depthMaterial;
      gl.setRenderTarget(renderTarget);
      gl.render(scene, shadowCameraRef.value);
      scene.overrideMaterial = initialOverrideMaterial;

      this.#blurShadows(blur);
      if (smooth) this.#blurShadows(blur * 0.4);

      gl.setRenderTarget(null);
      scene.background = initialBackground;
      this.#count++;
    }
  }

  #blurShadows(blur: number) {
    const {
      renderTarget,
      blurPlane,
      horizontalBlurMaterial,
      verticalBlurMaterial,
      renderTargetBlur,
      shadowCameraRef,
    } = this.get();
    const gl = this.store.get((s) => s.gl);

    blurPlane.visible = true;

    blurPlane.material = horizontalBlurMaterial;
    horizontalBlurMaterial.uniforms.tDiffuse.value = renderTarget.texture;
    horizontalBlurMaterial.uniforms.h.value = blur / 256;

    gl.setRenderTarget(renderTargetBlur);
    gl.render(blurPlane, shadowCameraRef.value);

    blurPlane.material = verticalBlurMaterial;
    verticalBlurMaterial.uniforms.tDiffuse.value = renderTargetBlur.texture;
    verticalBlurMaterial.uniforms.v.value = blur / 256;

    gl.setRenderTarget(renderTarget);
    gl.render(blurPlane, shadowCameraRef.value);

    blurPlane.visible = false;
  }
}
