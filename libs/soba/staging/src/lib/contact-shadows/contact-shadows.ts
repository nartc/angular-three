import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  is,
  makeColor,
  makeVector3,
  NgtObjectInputs,
  NgtObjectInputsState,
  NgtObjectPassThrough,
  NgtRadianPipe,
  NumberInput,
  provideObjectHostRef,
  Ref,
} from '@angular-three/core';
import { NgtOrthographicCamera } from '@angular-three/core/cameras';
import { NgtGroup } from '@angular-three/core/group';
import { NgtMeshBasicMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/meshes';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { tap } from 'rxjs';
import { HorizontalBlurShader, VerticalBlurShader } from 'three-stdlib';
import * as THREE from 'three/src/Three';

export interface NgtSobaContactShadowsState extends NgtObjectInputsState<THREE.Group> {
  opacity: number;
  width: number;
  height: number;
  blur: number;
  far: number;
  smooth: boolean;
  resolution: number;
  frames: number;
  depthWrite: boolean;
}

@Component({
  selector: 'ngt-soba-contact-shadows',
  standalone: true,
  template: `
    <ngt-group
      (beforeRender)="onBeforeRender($event.object)"
      [ngtObjectInputs]="this"
      [ngtObjectOutputs]="this"
      [rotation]="[90 | radian, 0, 0]"
      name="soba-contact-shadows"
    >
      <ng-container *ngIf="shadowViewModel$ | async as viewModel">
        <ngt-mesh [geometry]="viewModel.planeGeometry" [scale]="[1, -1, 1]" [rotation]="[-90 | radian, 0, 0]">
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideObjectHostRef(NgtSobaContactShadows)],
})
export class NgtSobaContactShadows extends NgtObjectInputs<THREE.Group, NgtSobaContactShadowsState> {
  @Input() set opacity(opacity: NumberInput) {
    this.set({ opacity: coerceNumberProperty(opacity) });
  }
  get opacity() {
    return this.get((s) => s.opacity);
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
    return this.get((s) => s.far);
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
    return this.get((s) => s.depthWrite);
  }

  private count = 1;
  readonly shadowViewModel$ = this.select(
    this.select((s) => s.priority),
    this.select((s) => s['planeGeometry']),
    this.select((s) => s['renderTarget']),
    this.select((s) => s.opacity),
    this.select((s) => s.depthWrite),
    this.select((s) => s['scaledWidth']),
    this.select((s) => s['scaledHeight']),
    this.select((s) => s.far),
    (priority, planeGeometry, renderTarget, opacity, depthWrite, width, height, far) => ({
      priority,
      planeGeometry,
      renderTarget,
      opacity,
      depthWrite,
      width,
      height,
      far,
    })
  );
  get planeGeometry() {
    return this.get((s) => s['planeGeometry']);
  }
  get renderTarget() {
    return this.get((s) => s['renderTarget']);
  }

  get shadowCameraRef() {
    return this.get((s) => s['shadowCameraRef']);
  }

  protected override preInit() {
    super.preInit();
    this.set((state) => {
      return {
        shadowCameraRef: new Ref(),
        scale: is.equ(state.scale.toArray(), makeVector3(1).toArray()) ? makeVector3(10) : state.scale,
        frames: state.frames ?? Infinity,
        opacity: state.opacity ?? 1,
        width: state.width ?? 1,
        height: state.height ?? 1,
        blur: state.blur ?? 1,
        far: state.far ?? 10,
        resolution: state.resolution ?? 512,
        smooth: state.smooth ?? true,
        color: is.equ(state.color.toArray(), makeColor().toArray()) ? makeColor('#000000') : state.color,
        depthWrite: state.depthWrite ?? false,
      };
    });
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(this.store.ready$, () => {
        // reset width and height
        this.set(
          this.select(
            this.select((s) => s.width),
            this.select((s) => s.height),
            this.select((s) => s.scale),
            (width, height, scale) => {
              return {
                scaledWidth: width * scale.x,
                scaledHeight: height * scale.y,
              };
            }
          )
        );

        this.setShadows(
          this.select(
            this.select((s) => s.resolution),
            this.select((s) => s['scaledWidth']),
            this.select((s) => s['scaledHeight']),
            this.select((s) => s.scale),
            this.select((s) => s.color)
          )
        );
      });
    });
  }

  private readonly setShadows = this.effect<{}>(
    tap(() => {
      const { resolution, scaledWidth: width, scaledHeight: height, color } = this.get();
      const gl = this.store.get((s) => s.gl);

      const renderTarget = new THREE.WebGLRenderTarget(resolution, resolution);
      renderTarget.texture.encoding = gl.outputEncoding;

      const renderTargetBlur = new THREE.WebGLRenderTarget(resolution, resolution);
      renderTargetBlur.texture.generateMipmaps = renderTarget.texture.generateMipmaps = false;

      const planeGeometry = new THREE.PlaneBufferGeometry(width, height).rotateX(Math.PI / 2);
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

  onBeforeRender(group: THREE.Group) {
    group.scale.setScalar(1);
    const { shadowCameraRef, frames, depthMaterial, renderTarget, smooth, blur } = this.get();
    const gl = this.store.get((s) => s.gl);
    const scene = this.store.get((s) => s.scene);

    if (shadowCameraRef.value && renderTarget && (frames === Infinity || this.count < frames)) {
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
      this.get();
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

@NgModule({
  imports: [NgtSobaContactShadows],
  exports: [NgtSobaContactShadows],
})
export class NgtSobaContactShadowsModule {}
