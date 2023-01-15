import {
  extend,
  injectNgtRef,
  injectNgtStore,
  NgtArgs,
  NgtPush,
  NgtRxStore,
} from '@angular-three/core';
import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit } from '@angular/core';
import { RxActionFactory } from '@rx-angular/state/actions';
import {
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshDepthMaterial,
  OrthographicCamera,
  PlaneGeometry,
  ShaderMaterial,
  WebGLRenderTarget,
} from 'three';
import { HorizontalBlurShader, VerticalBlurShader } from 'three-stdlib';

extend({
  Group,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
});

@Component({
  selector: 'ngts-contact-shadows',
  standalone: true,
  template: `
    <ngt-group ngtCompound [ref]="groupRef" [rotation]="[Math.PI / 2, 0, 0]">
      <ng-container *ngIf="contactShadows$ | ngtPush : null as contactShadows">
        <ngt-mesh
          [renderOrder]="get('renderOrder')"
          [geometry]="contactShadows.planeGeometry"
          [scale]="[1, -1, 1]"
          [rotation]="[-Math.PI / 2, 0, 0]"
        >
          <ngt-mesh-basic-material
            [map]="contactShadows.renderTarget.texture"
            transparent
            [opacity]="get('opacity')"
            [depthWrite]="get('depthWrite')"
          >
            <ngt-value [rawValue]="encoding" attach="map.encoding" />
          </ngt-mesh-basic-material>
        </ngt-mesh>
        <ngt-orthographic-camera *args="get('cameraArgs')" [ref]="shadowCameraRef" />
      </ng-container>
    </ngt-group>
  `,
  imports: [NgIf, NgtPush, NgtArgs],
  providers: [RxActionFactory],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsContactShadows extends NgtRxStore implements OnInit {
  readonly #store = injectNgtStore();
  readonly #actions = inject(RxActionFactory<{ setBeforeRender: void }>).create();
  readonly shadowCameraRef = injectNgtRef<OrthographicCamera>();
  readonly encoding = this.#store.get('gl', 'outputEncoding');
  readonly contactShadows$ = this.select('contactShadows');
  readonly Math = Math;

  @Input() groupRef = injectNgtRef<Group>();

  @Input() set opacity(opacity: number) {
    this.set({ opacity: opacity === undefined ? this.get('opacity') : opacity });
  }

  @Input() set width(width: number) {
    this.set({ width: width === undefined ? this.get('width') : width });
  }

  @Input() set height(height: number) {
    this.set({ height: height === undefined ? this.get('height') : height });
  }

  @Input() set blur(blur: number) {
    this.set({ blur: blur === undefined ? this.get('blur') : blur });
  }

  @Input() set far(far: number) {
    this.set({ far: far === undefined ? this.get('far') : far });
  }

  @Input() set smooth(smooth: boolean) {
    this.set({ smooth: smooth === undefined ? this.get('smooth') : smooth });
  }

  @Input() set resolution(resolution: number) {
    this.set({ resolution: resolution === undefined ? this.get('resolution') : resolution });
  }

  @Input() set frames(frames: number) {
    this.set({ frames: frames === undefined ? this.get('frames') : frames });
  }

  @Input() set scale(scale: number | [x: number, y: number]) {
    this.set({ scale: scale === undefined ? this.get('scale') : scale });
  }

  @Input() set color(color: THREE.ColorRepresentation) {
    this.set({ color: color === undefined ? this.get('color') : color });
  }

  @Input() set depthWrite(depthWrite: boolean) {
    this.set({ depthWrite: depthWrite === undefined ? this.get('depthWrite') : depthWrite });
  }

  @Input() set renderOrder(renderOrder: number) {
    this.set({ renderOrder: renderOrder === undefined ? this.get('renderOrder') : renderOrder });
  }

  override initialize() {
    super.initialize();
    this.set({
      scale: 10,
      frames: Infinity,
      opacity: 1,
      width: 1,
      height: 1,
      blur: 1,
      far: 10,
      resolution: 512,
      smooth: true,
      color: '#000000',
      depthWrite: false,
      renderOrder: 0,
    });
    this.connect(
      'scaledWidth',
      this.select(
        ['width', 'scale'],
        ({ width, scale }) => width * (Array.isArray(scale) ? scale[0] : scale || 1)
      )
    );
    this.connect(
      'scaledHeight',
      this.select(
        ['height', 'scale'],
        ({ height, scale }) => height * (Array.isArray(scale) ? scale[1] : scale || 1)
      )
    );
    this.connect(
      'cameraArgs',
      this.select(
        ['scaledWidth', 'scaledHeight', 'far'],
        ({ scaledWidth: width, scaledHeight: height, far }) => {
          return [-width / 2, width / 2, height / 2, -height / 2, 0, far];
        }
      )
    );
    this.connect(
      'contactShadows',
      this.select(
        ['resolution', 'scaledWidth', 'scaledHeight', 'scale', 'color'],
        ({ resolution, scaledWidth: width, scaledHeight: height, color }) => {
          const renderTarget = new WebGLRenderTarget(resolution, resolution);
          const renderTargetBlur = new WebGLRenderTarget(resolution, resolution);
          renderTargetBlur.texture.generateMipmaps = renderTarget.texture.generateMipmaps = false;
          const planeGeometry = new PlaneGeometry(width, height).rotateX(Math.PI / 2);
          const blurPlane = new Mesh(planeGeometry);
          const depthMaterial = new MeshDepthMaterial();
          depthMaterial.depthTest = depthMaterial.depthWrite = false;
          depthMaterial.onBeforeCompile = (shader) => {
            shader.uniforms = {
              ...shader.uniforms,
              ucolor: { value: new Color(color) },
            };
            shader.fragmentShader = shader.fragmentShader.replace(
              `void main() {`, //
              `uniform vec3 ucolor;
           void main() {
          `
            );
            shader.fragmentShader = shader.fragmentShader.replace(
              'vec4( vec3( 1.0 - fragCoordZ ), opacity );',
              // Colorize the shadow, multiply by the falloff so that the center can remain darker
              'vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );'
            );
          };

          const horizontalBlurMaterial = new ShaderMaterial(HorizontalBlurShader);
          const verticalBlurMaterial = new ShaderMaterial(VerticalBlurShader);
          verticalBlurMaterial.depthTest = horizontalBlurMaterial.depthTest = false;

          return {
            renderTarget,
            planeGeometry,
            depthMaterial,
            blurPlane,
            horizontalBlurMaterial,
            verticalBlurMaterial,
            renderTargetBlur,
          };
        }
      )
    );
  }

  ngOnInit() {
    this.#setBeforeRender();
  }

  #setBeforeRender() {
    let count = 0;
    this.effect(this.#actions.setBeforeRender$, () =>
      this.#store.get('internal').subscribe(({ scene, gl }) => {
        const {
          frames,
          blur,
          contactShadows: { depthMaterial, renderTarget },
          smooth,
        } = this.get();

        if (this.shadowCameraRef.nativeElement && (frames === Infinity || count < frames)) {
          const initialBackground = scene.background;
          scene.background = null;
          const initialOverrideMaterial = scene.overrideMaterial;
          scene.overrideMaterial = depthMaterial;
          gl.setRenderTarget(renderTarget);
          gl.render(scene, this.shadowCameraRef.nativeElement);
          scene.overrideMaterial = initialOverrideMaterial;

          this.#blurShadows(blur);
          if (smooth) this.#blurShadows(blur * 0.4);

          gl.setRenderTarget(null);
          scene.background = initialBackground;
          count++;
        }
      })
    );
    this.#actions.setBeforeRender();
  }

  #blurShadows(blur: number) {
    const {
      blurPlane,
      horizontalBlurMaterial,
      verticalBlurMaterial,
      renderTargetBlur,
      renderTarget,
    } = this.get('contactShadows');
    const gl = this.#store.get('gl');

    blurPlane.visible = true;

    blurPlane.material = horizontalBlurMaterial;
    horizontalBlurMaterial.uniforms.tDiffuse.value = renderTarget.texture;
    horizontalBlurMaterial.uniforms.h.value = (blur * 1) / 256;

    gl.setRenderTarget(renderTargetBlur);
    gl.render(blurPlane, this.shadowCameraRef.nativeElement);

    blurPlane.material = verticalBlurMaterial;
    verticalBlurMaterial.uniforms.tDiffuse.value = renderTargetBlur.texture;
    verticalBlurMaterial.uniforms.v.value = (blur * 1) / 256;

    gl.setRenderTarget(renderTarget);
    gl.render(blurPlane, this.shadowCameraRef.nativeElement);

    blurPlane.visible = false;
  }
}
