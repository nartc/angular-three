import {
  AnyConstructor,
  applyProps,
  coerceNumberProperty,
  is,
  NgtUnknownInstance,
  NumberInput,
  provideCommonMaterialRef,
  Ref,
  tapEffect,
} from '@angular-three/core';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { BlurPass, MeshReflectorMaterial } from '@angular-three/soba/materials';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { Observable, tap } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-soba-mesh-reflector-material',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonMaterialRef(NgtSobaMeshReflectorMaterial)],
})
export class NgtSobaMeshReflectorMaterial extends NgtMeshStandardMaterial {
  @Input() set resolution(resolution: NumberInput) {
    this.set({ resolution: coerceNumberProperty(resolution) });
  }

  @Input() set mixBlur(mixBlur: NumberInput) {
    this.set({ mixBlur: coerceNumberProperty(mixBlur) });
  }

  @Input() set mixStrength(mixStrength: NumberInput) {
    this.set({ mixStrength: coerceNumberProperty(mixStrength) });
  }

  @Input() set blur(blur: [number, number] | NumberInput) {
    const blurArr = is.arr(blur) ? blur : [coerceNumberProperty(blur), coerceNumberProperty(blur)];
    this.set({ blur: blurArr, hasBlur: blurArr[0] + blurArr[1] > 0 });
  }

  @Input() set mirror(mirror: NumberInput) {
    this.set({ mirror: coerceNumberProperty(mirror) });
  }

  @Input() set minDepthThreshold(minDepthThreshold: NumberInput) {
    this.set({ minDepthThreshold: coerceNumberProperty(minDepthThreshold) });
  }

  @Input() set maxDepthThreshold(maxDepthThreshold: NumberInput) {
    this.set({ maxDepthThreshold: coerceNumberProperty(maxDepthThreshold) });
  }

  @Input() set depthScale(depthScale: NumberInput) {
    this.set({ depthScale: coerceNumberProperty(depthScale) });
  }

  @Input() set depthToBlurRatioBias(depthToBlurRatioBias: NumberInput) {
    this.set({ depthToBlurRatioBias: coerceNumberProperty(depthToBlurRatioBias) });
  }

  @Input() set distortionMap(distortionMap: THREE.Texture) {
    this.set({ distortionMap });
  }

  @Input() set distortion(distortion: NumberInput) {
    this.set({ distortion: coerceNumberProperty(distortion) });
  }

  @Input() set mixContrast(mixContrast: NumberInput) {
    this.set({ mixContrast: coerceNumberProperty(mixContrast) });
  }

  @Input() set reflectorOffset(reflectorOffset: NumberInput) {
    this.set({ reflectorOffset: coerceNumberProperty(reflectorOffset) });
  }

  protected readonly reflectorPlane = new THREE.Plane();
  protected readonly normal = new THREE.Vector3();
  protected readonly reflectorWorldPosition = new THREE.Vector3();
  protected readonly cameraWorldPosition = new THREE.Vector3();
  protected readonly rotationMatrix = new THREE.Matrix4();
  protected readonly lookAtPosition = new THREE.Vector3(0, 0, -1);
  protected readonly clipPlane = new THREE.Vector4();
  protected readonly view = new THREE.Vector3();
  protected readonly target = new THREE.Vector3();
  protected readonly q = new THREE.Vector4();
  protected readonly virtualCamera = new THREE.PerspectiveCamera();

  readonly materialProps$ = this.select(
    this.store.select((s) => s.gl),
    this.select((s) => s['blur']),
    this.select((s) => s['resolution']),
    this.select((s) => s['mirror']),
    this.select((s) => s['hasBlur']),
    this.select((s) => s['mixBlur']),
    this.select((s) => s['mixStrength']),
    this.select((s) => s['minDepthThreshold']),
    this.select((s) => s['maxDepthThreshold']),
    this.select((s) => s['depthScale']),
    this.select((s) => s['depthToBlurRatioBias']),
    this.select((s) => s['distortion']),
    this.select((s) => s['distortionMap']),
    this.select((s) => s['mixContrast'])
  );

  override get materialType(): AnyConstructor<MeshReflectorMaterial> {
    return MeshReflectorMaterial;
  }

  protected override preInit() {
    super.preInit();
    this.set((state) => {
      const blur = state['blur'] ?? [0, 0];
      const hasBlur = blur[0] + blur[1] > 0;
      return {
        fbo1Ref: new Ref<THREE.WebGLRenderTarget>(),
        fbo2Ref: new Ref<THREE.WebGLRenderTarget>(),
        blurPassRef: new Ref<BlurPass>(),
        textureMatrix: new THREE.Matrix4(),
        mixBlur: state['mixBlur'] ?? 0,
        mixStrength: state['mixStrength'] ?? 1,
        resolution: state['resolution'] ?? 256,
        hasBlur,
        minDepthThreshold: state['minDepthThreshold'] ?? 0.9,
        maxDepthThreshold: state['maxDepthThreshold'] ?? 1,
        depthScale: state['depthScale'] ?? 0,
        depthToBlurRatioBias: state['depthToBlurRatioBias'] ?? 0.25,
        mirror: state['mirror'] ?? 0,
        distortion: state['distortion'] ?? 1,
        mixContrast: state['mixContrast'] ?? 1,
        reflectorOffset: state['reflectorOffset'] ?? 0,
      };
    });
  }

  protected override postInit() {
    super.postInit();
    this.setReflectorOptions(this.select(this.instance$, this.materialProps$));
    this.setDefines(this.materialProps$);
    this.setRenderTargets(this.materialProps$);
    this.registerBeforeRender();
  }

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      textureMatrix: false,
      hasBlur: false,
      mixBlur: false,
      mixStrength: false,
      mirror: false,
      minDepthThreshold: false,
      maxDepthThreshold: false,
      depthScale: false,
      depthToBlurRatioBias: false,
      distortionMap: true,
      distortion: false,
      mixContrast: false,
      tDiffuse: true,
      tDepth: true,
      tDiffuseBlur: true,
    };
  }

  protected override get ctorParams$(): Observable<{}> {
    return this.select((s) => s['reflectorDefines']);
  }

  private readonly setReflectorOptions = this.effect(
    tap(() => {
      const { reflectorOffset, resolution, reflectorDefines } = this.get();

      const props = {
        reflectorOffset,
        resolution,
        defines: reflectorDefines,
      };

      applyProps(this.instanceValue, props);
    })
  );

  private readonly setRenderTargets = this.effect(
    tap(() => {
      const gl = this.store.get((s) => s.gl);
      const {
        resolution,
        blur,
        minDepthThreshold,
        maxDepthThreshold,
        depthScale,
        depthToBlurRatioBias,
        fbo1Ref,
        fbo2Ref,
        blurPassRef,
      } = this.get();

      const parameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        encoding: gl.outputEncoding,
        type: THREE.HalfFloatType,
      };

      const fbo1 = new THREE.WebGLRenderTarget(resolution, resolution, parameters);
      fbo1.depthBuffer = true;
      fbo1.depthTexture = new THREE.DepthTexture(resolution, resolution);
      fbo1.depthTexture.format = THREE.DepthFormat;
      fbo1.depthTexture.type = THREE.UnsignedShortType;
      const fbo2 = new THREE.WebGLRenderTarget(resolution, resolution, parameters);
      const blurPass = new BlurPass({
        gl,
        resolution,
        width: blur[0],
        height: blur[1],
        minDepthThreshold,
        maxDepthThreshold,
        depthScale,
        depthToBlurRatioBias,
      });

      fbo1Ref.set(fbo1);
      fbo2Ref.set(fbo2);
      blurPassRef.set(blurPass);

      this.set({
        tDiffuse: fbo1.texture,
        tDepth: fbo1.depthTexture,
        tDiffuseBlur: fbo2.texture,
      });
    })
  );

  private readonly setDefines = this.effect(
    tap(() => {
      const { hasBlur, depthScale, distortionMap } = this.get();
      this.set({
        reflectorDefines: {
          USE_BLUR: hasBlur ? '' : undefined,
          USE_DEPTH: depthScale > 0 ? '' : undefined,
          USE_DISTORTION: distortionMap ? '' : undefined,
        },
      });
    })
  );

  private readonly registerBeforeRender = this.effect<void>(
    tapEffect(() =>
      this.store.registerBeforeRender({
        callback: () => {
          const material = this.instanceValue as NgtUnknownInstance<MeshReflectorMaterial>;
          const parent = material?.__ngt__?.parent?.value as unknown as THREE.Mesh;
          if (!parent) return;

          const gl = this.store.get((s) => s.gl);
          const scene = this.store.get((s) => s.scene);
          const { fbo1Ref, fbo2Ref, blurPassRef, hasBlur } = this.get();

          if (!fbo1Ref.value || !fbo2Ref.value) {
            return;
          }

          parent.visible = false;
          const currentXrEnabled = gl.xr.enabled;
          const currentShadowAutoUpdate = gl.shadowMap.autoUpdate;
          this.beforeRender(material);
          gl.xr.enabled = false;
          gl.shadowMap.autoUpdate = false;
          gl.setRenderTarget(fbo1Ref.value);
          gl.state.buffers.depth.setMask(true);

          if (!gl.autoClear) {
            gl.clear();
          }

          gl.render(scene, this.virtualCamera);

          if (hasBlur && blurPassRef.value && fbo1Ref.value && fbo2Ref.value) {
            blurPassRef.value.render(gl, fbo1Ref.value, fbo2Ref.value);
          }

          gl.xr.enabled = currentXrEnabled;
          gl.shadowMap.autoUpdate = currentShadowAutoUpdate;
          parent.visible = true;
          gl.setRenderTarget(null);
        },
      })
    )
  );

  private beforeRender(material: NgtUnknownInstance<MeshReflectorMaterial>) {
    const parent = material.__ngt__.parent?.value as unknown as THREE.Mesh;
    if (!parent) return;

    const { camera } = this.store.get();
    const { reflectorOffset, textureMatrix } = this.get();

    this.reflectorWorldPosition.setFromMatrixPosition(parent.matrixWorld);
    this.cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);
    this.rotationMatrix.extractRotation(parent.matrixWorld);
    this.normal.set(0, 0, 1);
    this.normal.applyMatrix4(this.rotationMatrix);
    this.reflectorWorldPosition.addScaledVector(this.normal, reflectorOffset);
    this.view.subVectors(this.reflectorWorldPosition, this.cameraWorldPosition);
    // Avoid rendering when reflector is facing away
    if (this.view.dot(this.normal) > 0) return;
    this.view.reflect(this.normal).negate();
    this.view.add(this.reflectorWorldPosition);
    this.rotationMatrix.extractRotation(camera.matrixWorld);
    this.lookAtPosition.set(0, 0, -1);
    this.lookAtPosition.applyMatrix4(this.rotationMatrix);
    this.lookAtPosition.add(this.cameraWorldPosition);
    this.target.subVectors(this.reflectorWorldPosition, this.lookAtPosition);
    this.target.reflect(this.normal).negate();
    this.target.add(this.reflectorWorldPosition);
    this.virtualCamera.position.copy(this.view);
    this.virtualCamera.up.set(0, 1, 0);
    this.virtualCamera.up.applyMatrix4(this.rotationMatrix);
    this.virtualCamera.up.reflect(this.normal);
    this.virtualCamera.lookAt(this.target);
    this.virtualCamera.far = camera.far; // Used in WebGLBackground
    this.virtualCamera.updateMatrixWorld();
    this.virtualCamera.projectionMatrix.copy(camera.projectionMatrix);
    // Update the texture matrix
    textureMatrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
    textureMatrix.multiply(this.virtualCamera.projectionMatrix);
    textureMatrix.multiply(this.virtualCamera.matrixWorldInverse);
    textureMatrix.multiply(parent.matrixWorld);
    // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
    // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
    this.reflectorPlane.setFromNormalAndCoplanarPoint(this.normal, this.reflectorWorldPosition);
    this.reflectorPlane.applyMatrix4(this.virtualCamera.matrixWorldInverse);
    this.clipPlane.set(
      this.reflectorPlane.normal.x,
      this.reflectorPlane.normal.y,
      this.reflectorPlane.normal.z,
      this.reflectorPlane.constant
    );
    const projectionMatrix = this.virtualCamera.projectionMatrix;
    this.q.x = (Math.sign(this.clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
    this.q.y = (Math.sign(this.clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
    this.q.z = -1.0;
    this.q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];
    // Calculate the scaled plane vector
    this.clipPlane.multiplyScalar(2.0 / this.clipPlane.dot(this.q));
    // Replacing the third row of the projection matrix
    projectionMatrix.elements[2] = this.clipPlane.x;
    projectionMatrix.elements[6] = this.clipPlane.y;
    projectionMatrix.elements[10] = this.clipPlane.z + 1.0;
    projectionMatrix.elements[14] = this.clipPlane.w;
  }
}

@NgModule({
  imports: [NgtSobaMeshReflectorMaterial],
  exports: [NgtSobaMeshReflectorMaterial],
})
export class NgtSobaMeshReflectorMaterialModule {}
