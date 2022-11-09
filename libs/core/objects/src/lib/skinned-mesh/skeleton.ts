import {
  AnyFunction,
  coerceNumberProperty,
  injectSkinnedMeshHostRef,
  make,
  NgtInstance,
  NgtMatrix4,
  NgtPrepareInstanceFn,
  NgtRef,
  NumberInput,
  provideInstanceRef,
  provideNgtInstance,
} from '@angular-three/core';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import * as THREE from 'three';
import { NgtSkinnedMesh } from './skinned-mesh';

@Component({
  selector: 'ngt-skeleton',
  standalone: true,
  template: `
    <ng-content></ng-content>
  `,

  providers: [provideNgtInstance(NgtSkeleton), provideInstanceRef(NgtSkeleton)],
})
export class NgtSkeleton extends NgtInstance<THREE.Skeleton> {
  @Input() set args(args: ConstructorParameters<typeof THREE.Skeleton>) {
    this.set({ instanceArgs: args });
  }

  @Input() set bones(bones: THREE.Bone[]) {
    this.set({ bones });
  }

  @Input() set boneInverses(boneInverses: NgtMatrix4[]) {
    this.set({
      boneInverses: boneInverses.map((datum) => make(THREE.Matrix4, datum)),
    });
  }

  @Input() set boneMatrices(boneMatrices: Float32Array) {
    this.set({ boneMatrices });
  }

  @Input() set boneTexture(boneTexture: null | THREE.DataTexture) {
    this.set({ boneTexture });
  }

  @Input() set boneTextureSize(boneTextureSize: NumberInput) {
    this.set({ boneTextureSize: coerceNumberProperty(boneTextureSize) });
  }

  @Input() set frame(frame: NumberInput) {
    this.set({ frame: coerceNumberProperty(frame) });
  }

  readonly #skinnedMesh = inject(NgtSkinnedMesh, { optional: true });
  override parentRef = (() =>
    this.#skinnedMesh?.instance) as AnyFunction<NgtRef>;
  override parentHostRef = injectSkinnedMeshHostRef({
    optional: true,
    skipSelf: true,
  });

  override preInit() {
    super.preInit();
    this.set((s) => ({
      attach: s.attach.length ? s.attach : ['skeleton'],
      bones: s['bones'] || [],
      boneInverses: s['boneInverses'] || [],
      boneMatrices: s['boneMatrices'] || (null as unknown as Float32Array),
      boneTexture: s['boneTexture'] || null,
      boneTextureSize: s['boneTextureSize'] || 0,
      frame: s['frame'] || -1,
    }));
  }

  override initFn(
    prepareInstance: NgtPrepareInstanceFn<THREE.Skeleton>
  ): (() => void) | void | undefined {
    const instanceArgs = this.get((s) => s.instanceArgs);
    const { bones, boneInverses } = this.get();

    const skeletonArgs = [...instanceArgs];

    if (skeletonArgs.length === 0) {
      if (bones.length) {
        skeletonArgs[0] = bones;
      }

      if (boneInverses.length) {
        skeletonArgs[1] = boneInverses;
      }
    }

    const skeleton = prepareInstance(
      new THREE.Skeleton(
        ...(skeletonArgs as ConstructorParameters<typeof THREE.Skeleton>)
      )
    );

    if (!this.#skinnedMesh?.instanceValue.skeleton) {
      this.#skinnedMesh?.bind(skeleton);
    }

    return () => {
      skeleton.dispose();
    };
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      bones: false,
      boneTexture: false,
      boneTextureSize: false,
      boneMatrices: false,
      boneInverses: false,
      frame: false,
    };
  }
}
