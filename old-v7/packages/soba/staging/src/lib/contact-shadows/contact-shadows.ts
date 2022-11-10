import {
  coerceBoolean,
  coerceNumber,
  make,
  NgtBooleanInput,
  NgtNumberInput,
  NgtObjectPassThrough,
  NgtRadianPipe,
  NgtRef,
  skipFirstUndefined,
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
      shouldPassThroughRef
      [ngtObjectPassThrough]="this"
      [rotation]="[90 | radian, 0, 0]"
      (beforeRender)="onBeforeRender($event.object)"
    >
      <ng-container *ngIf="shadowViewModel$ | async as viewModel">
        <ngt-mesh [geometry]="viewModel['planeGeometry']" [scale]="[1, -1, 1]" [rotation]="[-90 | radian, 0, 0]">
          <ngt-mesh-basic-material
            [map]="viewModel['renderTarget']['texture']"
            transparent
            [opacity]="viewModel.opacity"
            [depthWrite]="viewModel['depthWrite']"
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
            viewModel['far']
          ]"
        ></ngt-orthographic-camera>
      </ng-container>
    </ngt-group>
  `,
  imports: [
    NgtGroup,
    NgtObjectPassThrough,
    NgtRadianPipe,
    NgtMesh,
    NgtMeshBasicMaterial,
    NgtOrthographicCamera,
    NgIf,
    AsyncPipe,
  ],
})
export class NgtSobaContactShadows extends NgtGroup {
  override isWrapper = true;

  @Input() set opacity(opacity: NgtNumberInput) {
    this.set({ opacity: coerceNumber(opacity) });
  }
  get opacity() {
    return this.getState((s) => s['opacity']);
  }

  @Input() set width(width: NgtNumberInput) {
    this.set({ width: coerceNumber(width) });
  }

  get width() {
    return this.getState((s) => s['scaledWidth']);
  }
  @Input() set height(height: NgtNumberInput) {
    this.set({ height: coerceNumber(height) });
  }

  get height() {
    return this.getState((s) => s['scaledHeight']);
  }
  @Input() set blur(blur: NgtNumberInput) {
    this.set({ blur: coerceNumber(blur) });
  }

  @Input() set far(far: NgtNumberInput) {
    this.set({ far: coerceNumber(far) });
  }

  get far() {
    return this.getState((s) => s['far']);
  }

  @Input() set smooth(smooth: NgtBooleanInput) {
    this.set({ smooth: coerceBoolean(smooth) });
  }

  @Input() set resolution(resolution: NgtNumberInput) {
    this.set({ resolution: coerceNumber(resolution) });
  }

  @Input() set frames(frames: NgtNumberInput) {
    this.set({ frames: coerceNumber(frames) });
  }

  @Input() set depthWrite(depthWrite: NgtBooleanInput) {
    this.set({ depthWrite: coerceBoolean(depthWrite) });
  }
  get depthWrite() {
    return this.getState((s) => s['depthWrite']);
  }

  private count = 1;

  readonly shadowViewModel$ = this.select(
    this.select((s) => s.priority),
    this.select((s) => s['planeGeometry']),
    this.select((s) => s['renderTarget']),
    this.select((s) => s['opacity']),
    this.select((s) => s['depthWrite']),
    this.select((s) => s['scaledWidth']),
    this.select((s) => s['scaledHeight']),
    this.select((s) => s['far']),
    (priority, planeGeometry, renderTarget, opacity, depthWrite, width, height, far) => ({
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
    return this.getState((s) => s['shadowCameraRef']);
  }

  private readonly setShadows = this.effect(
    tap(() => {
      const { resolution, scaledWidth: width, scaledHeight: height, color } = this.getState();
      const gl = this.store.getState((s) => s.gl);

      const renderTarget = new THREE.WebGLRenderTarget(resolution, resolution);
      renderTarget.texture.encoding = gl.outputEncoding;

      const renderTargetBlur = new THREE.WebGLRenderTarget(resolution, resolution);
      renderTargetBlur.texture.generateMipmaps = renderTarget.texture.generateMipmaps = false;

      const planeGeometry = new THREE.PlaneGeometry(width, height).rotateX(Math.PI / 2);
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

      const horizontalBlurMaterial = new THREE.ShaderMaterial(HorizontalBlurShader);
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

  override initialize() {
    super.initialize();
    this.set({
      shadowCameraRef: new NgtRef(),
      scale: make(THREE.Vector3, 10),
      frames: Infinity,
      opacity: 1,
      width: 1,
      height: 1,
      blur: 1,
      far: 10,
      resolution: 512,
      smooth: true,
      color: make(THREE.Color, '#000000'),
      depthWrite: false,
    });
  }

  override postInit() {
    super.postInit();
    this.set(
      this.select(
        this.select((s) => s['width']),
        this.select((s) => s['height']),
        this.select((s) => s.scale),
        (width, height, scale) => ({
          scaledWidth: width * scale.x,
          scaledHeight: height * scale.y,
        })
      )
    );

    this.setShadows(
      this.select(
        this.select((s) => s['resolution']),
        this.select((s) => s['scaledWidth']).pipe(skipFirstUndefined()),
        this.select((s) => s['scaledHeight']).pipe(skipFirstUndefined()),
        this.select((s) => s.scale),
        this.select((s) => s.color),
        this.defaultProjector
      )
    );
  }

  onBeforeRender(group: THREE.Group) {
    group.scale.setScalar(1);
    const { shadowCameraRef, frames, depthMaterial, renderTarget, smooth, blur } = this.getState();
    const gl = this.store.getState((s) => s.gl);
    const scene = this.store.getState((s) => s.scene);

    if (shadowCameraRef && shadowCameraRef.value && renderTarget && (frames === Infinity || this.count < frames)) {
      const initialBackground = scene.background;
      scene.background = null;
      const initialOverrideMaterial = scene.overrideMaterial;
      scene.overrideMaterial = depthMaterial;
      gl.setRenderTarget(renderTarget);
      gl.render(scene, shadowCameraRef.value);
      scene.overrideMaterial = initialOverrideMaterial;

      this.blurShadows(blur);
      if (smooth) this.blurShadows(blur * 0.4);

      gl.setRenderTarget(null);
      scene.background = initialBackground;
      this.count++;
    }
  }

  private blurShadows(blur: number) {
    const { renderTarget, blurPlane, horizontalBlurMaterial, verticalBlurMaterial, renderTargetBlur, shadowCameraRef } =
      this.getState();
    const gl = this.store.getState((s) => s.gl);

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
