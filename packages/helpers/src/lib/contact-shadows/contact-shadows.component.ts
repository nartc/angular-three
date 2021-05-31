import {
  AnimationReady,
  CanvasStore,
  Object3dControllerDirective,
  OBJECT_3D_CONTROLLER_PROVIDER,
  OBJECT_3D_WATCHED_CONTROLLER,
} from '@angular-three/core';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  Mesh,
  MeshDepthMaterial,
  OrthographicCamera,
  PlaneBufferGeometry,
  ShaderMaterial,
  WebGLRenderTarget,
} from 'three';
import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader';
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader';

@Component({
  selector: 'ngt-contact-shadows',
  template: `
    <ngt-group
      o3d
      [name]="object3dController.name"
      [position]="object3dController.position"
      [rotation]="object3dController.rotation"
      [quaternion]="object3dController.quaternion"
      [scale]="object3dController.scale"
      [color]="object3dController.color"
      [userData]="object3dController.userData"
      [castShadow]="object3dController.castShadow"
      [receiveShadow]="object3dController.receiveShadow"
      [visible]="object3dController.visible"
      [matrixAutoUpdate]="object3dController.matrixAutoUpdate"
      [appendMode]="object3dController.appendMode"
      [appendTo]="object3dController.appendTo"
      (click)="object3dController.click.emit($event)"
      (contextmenu)="object3dController.contextmenu.emit($event)"
      (dblclick)="object3dController.dblclick.emit($event)"
      (pointerup)="object3dController.pointerup.emit($event)"
      (pointerdown)="object3dController.pointerdown.emit($event)"
      (pointerover)="object3dController.pointerover.emit($event)"
      (pointerout)="object3dController.pointerout.emit($event)"
      (pointerenter)="object3dController.pointerenter.emit($event)"
      (pointerleave)="object3dController.pointerleave.emit($event)"
      (pointermove)="object3dController.pointermove.emit($event)"
      (pointermissed)="object3dController.pointermissed.emit($event)"
      (pointercancel)="object3dController.pointercancel.emit($event)"
      (wheel)="object3dController.wheel.emit($event)"
    >
      <ngt-orthographic-camera
        (animateReady)="onCameraAnimateReady($event)"
        [args]="[-width / 2, width / 2, height / 2, -height / 2, 0, far]"
      ></ngt-orthographic-camera>
      <ngt-mesh
        o3d
        [geometry]="planeGeometry"
        [scale]="[1, -1, 1]"
        [rotation]="[-halfPi, 0, 0]"
      >
        <ngt-mesh-basic-material
          [parameters]="{
            map: renderTarget.texture,
            transparent: true,
            opacity: opacity
          }"
        ></ngt-mesh-basic-material>
      </ngt-mesh>
    </ngt-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [OBJECT_3D_CONTROLLER_PROVIDER],
})
export class ContactShadowsComponent implements OnInit, OnChanges {
  @Input() opacity = 1;
  @Input() width = 1;
  @Input() height = 1;
  @Input() blur = 1;
  @Input() far = 10;
  @Input() resolution = 256;

  halfPi = Math.PI / 2;

  renderTarget!: WebGLRenderTarget;
  renderTargetBlur!: WebGLRenderTarget;
  planeGeometry!: PlaneBufferGeometry;
  depthMaterial!: MeshDepthMaterial;
  blurPlane!: Mesh;
  horizontalBlurMaterial!: ShaderMaterial;
  verticalBlurMaterial!: ShaderMaterial;

  constructor(
    @Inject(OBJECT_3D_WATCHED_CONTROLLER)
    public readonly object3dController: Object3dControllerDirective,
    private readonly canvasStore: CanvasStore,
    private readonly ngZone: NgZone
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.ngZone.runOutsideAngular(() => {
      if (
        'resolution' in changes ||
        'width' in changes ||
        'height' in changes
      ) {
        this.setup();
      }
    });
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.setup();
    });
  }

  private setup() {
    this.renderTarget = new WebGLRenderTarget(this.resolution, this.resolution);
    this.renderTargetBlur = new WebGLRenderTarget(
      this.resolution,
      this.resolution
    );
    this.renderTargetBlur.texture.generateMipmaps =
      this.renderTarget.texture.generateMipmaps = false;

    this.planeGeometry = new PlaneBufferGeometry(
      this.width,
      this.height
    ).rotateX(Math.PI / 2) as PlaneBufferGeometry;
    this.blurPlane = new Mesh(this.planeGeometry);

    this.depthMaterial = new MeshDepthMaterial();
    this.depthMaterial.depthTest = this.depthMaterial.depthWrite = false;
    this.depthMaterial.onBeforeCompile = (shader) =>
      (shader.fragmentShader = shader.fragmentShader.replace(
        '1.0 - fragCoordZ ), opacity );',
        '0.0 ), ( 1.0 - fragCoordZ ) * 1.0 );'
      ));

    this.horizontalBlurMaterial = new ShaderMaterial(HorizontalBlurShader);
    this.verticalBlurMaterial = new ShaderMaterial(VerticalBlurShader);
    this.verticalBlurMaterial.depthTest =
      this.horizontalBlurMaterial.depthTest = false;
  }

  onCameraAnimateReady({
    animateObject,
    renderState: { scene, renderer },
  }: AnimationReady<OrthographicCamera>) {
    if (animateObject) {
      const initialBackground = scene.background;
      scene.background = null;
      scene.overrideMaterial = this.depthMaterial;
      renderer.setRenderTarget(this.renderTarget);
      renderer.render(scene, animateObject);
      scene.overrideMaterial = null;
      this.blurPlane.material = this.horizontalBlurMaterial;
      (this.blurPlane.material as any).uniforms.tDiffuse.value =
        this.renderTarget.texture;
      this.horizontalBlurMaterial.uniforms.h.value = this.blur / 256;
      renderer.setRenderTarget(this.renderTargetBlur);
      renderer.render(this.blurPlane, animateObject);
      this.blurPlane.material = this.verticalBlurMaterial;
      (this.blurPlane.material as any).uniforms.tDiffuse.value =
        this.renderTargetBlur.texture;
      this.verticalBlurMaterial.uniforms.v.value = this.blur / 256;
      renderer.setRenderTarget(this.renderTarget);
      renderer.render(this.blurPlane, animateObject);
      renderer.setRenderTarget(null);
      scene.background = initialBackground;
    }
  }
}
