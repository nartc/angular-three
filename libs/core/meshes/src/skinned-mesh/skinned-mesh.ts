import {
  AnyConstructor,
  AnyFunction,
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  make,
  NGT_HOST_BONE_REF,
  NGT_HOST_SKELETON_REF,
  NGT_HOST_SKINNED_MESH_REF,
  NgtCommonMesh,
  NgtInstance,
  NgtInstanceState,
  NgtMatrix4,
  NgtObject,
  NumberInput,
  provideCommonMeshRef,
  provideInstanceRef,
  provideObjectRef,
  Ref,
  tapEffect,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, inject, Input, NgModule } from '@angular/core';
import { pipe, withLatestFrom } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-skinned-mesh',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonMeshRef(NgtSkinnedMesh)],
})
export class NgtSkinnedMesh extends NgtCommonMesh<THREE.SkinnedMesh> {
  @Input() set skeleton(skeleton: THREE.Skeleton) {
    this.set({ skeleton });
  }

  @Input() set useVertexTexture(useVertexTexture: BooleanInput) {
    this.set({ useVertexTexture: coerceBooleanProperty(useVertexTexture) });
  }

  @Input() set bindMatrix(bindMatrix: NgtMatrix4) {
    this.set({ bindMatrix: make(THREE.Matrix4, bindMatrix) });
  }

  @Input() set bindMatrixInverse(bindMatrixInverse: NgtMatrix4) {
    this.set({
      bindMatrixInverse: make(THREE.Matrix4, bindMatrixInverse),
    });
  }

  @Input() set bindMode(bindMode: string) {
    this.set({ bindMode });
  }

  override get meshType(): AnyConstructor<THREE.SkinnedMesh> {
    return THREE.SkinnedMesh;
  }

  protected override get argsKeys(): string[] {
    return ['useVertexTexture'];
  }

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      bindMatrix: true,
      bindMatrixInverse: true,
      bindMode: true,
      skeleton: true,
    };
  }

  bind(skeleton: THREE.Skeleton) {
    this.instance.value.bind(
      skeleton,
      this.get((s) => s['bindMatrix'])
    );
  }
}

export interface NgtSkeletonState extends NgtInstanceState<THREE.Skeleton> {
  bones: THREE.Bone[];
  boneInverses: THREE.Matrix4[];
  boneMatrices: Float32Array;
  boneTexture: null | THREE.DataTexture;
  boneTextureSize: number;
  frame: number;
}

@Component({
  selector: 'ngt-skeleton',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideInstanceRef(NgtSkeleton)],
})
export class NgtSkeleton extends NgtInstance<THREE.Skeleton, NgtSkeletonState> {
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

  private skinnedMesh = inject(NgtSkinnedMesh, { optional: true });
  protected override parentRef = (() => this.skinnedMesh?.instance) as AnyFunction<Ref>;
  protected override parentHostRef = inject(NGT_HOST_SKINNED_MESH_REF, {
    optional: true,
    skipSelf: true,
  }) as AnyFunction<Ref>;

  constructor() {
    super();
    if (this.parentHostRef && !this.parentHostRef().value.isSkinnedMesh) {
      throw new Error('<ngt-skeleton> can only be used within <ngt-skinned-mesh>');
    }
  }

  protected override preInit() {
    this.set((state) => ({
      attach: state.attach.length ? state.attach : ['skeleton'],
      bones: state.bones || [],
      boneInverses: state.boneInverses || [],
      boneMatrices: state.boneMatrices || (null as unknown as Float32Array),
      boneTexture: state.boneTexture || null,
      boneTextureSize: state.boneTextureSize || 0,
      frame: state.frame || -1,
    }));
  }

  override ngOnInit() {
    super.ngOnInit();
    this.store.onReady(() => {
      this.init(this.instanceArgs$);
    });
  }

  private readonly init = this.effect<unknown[]>(
    pipe(
      withLatestFrom(
        this.select(
          this.select((s) => s.bones),
          this.select((s) => s.boneInverses),
          (bones, boneInverses) => ({ bones, boneInverses })
        )
      ),
      tapEffect(([instanceArgs, { bones, boneInverses }]) => {
        const skeletonArgs = [...instanceArgs];

        if (skeletonArgs.length === 0) {
          if (bones.length) {
            skeletonArgs[0] = bones;
          }

          if (boneInverses.length) {
            skeletonArgs[1] = boneInverses;
          }
        }

        const skeleton = this.prepareInstance(
          new THREE.Skeleton(...(skeletonArgs as ConstructorParameters<typeof THREE.Skeleton>))
        );

        if (!this.skinnedMesh?.instance.value.skeleton) {
          this.skinnedMesh?.bind(skeleton);
        }

        return () => {
          skeleton.dispose();
        };
      })
    )
  );

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      bones: false,
      boneTexture: false,
      boneTextureSize: false,
      boneMatrices: false,
      boneInverses: false,
      frame: false,
    };
  }
}

@Component({
  selector: 'ngt-bone',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideObjectRef(NgtBone)],
})
export class NgtBone extends NgtObject<THREE.Bone> {
  private hostBoneRef = inject(NGT_HOST_BONE_REF, { skipSelf: true, optional: true }) as AnyFunction<Ref>;
  private hostSkeletonRef = inject(NGT_HOST_SKELETON_REF, { skipSelf: true, optional: true }) as AnyFunction<Ref>;
  private hostSkinnedMeshRef = inject(NGT_HOST_SKINNED_MESH_REF, {
    skipSelf: true,
    optional: true,
  }) as AnyFunction<Ref>;

  private parentBone = inject(NgtBone, { skipSelf: true, optional: true });
  private parentSkinnedMesh = inject(NgtSkinnedMesh, { optional: true });
  private parentSkeleton = inject(NgtSkeleton, { optional: true });

  protected override parentRef = (() =>
    this.parentBone?.instance || this.parentSkinnedMesh?.instance) as AnyFunction<Ref>;
  protected override parentHostRef = this.hostBoneRef || this.hostSkinnedMeshRef;

  protected override objectInitFn(): THREE.Bone {
    return new THREE.Bone();
  }

  protected override postPrepare(bone: THREE.Bone) {
    if (this.parentSkeleton) {
      this.parentSkeleton.instance.value.bones.push(bone);
    } else if (this.hostSkeletonRef) {
      this.hostSkeletonRef().value.bones.push(bone);
    }
  }
}

@NgModule({
  imports: [NgtSkinnedMesh, NgtSkeleton, NgtBone],
  exports: [NgtSkinnedMesh, NgtSkeleton, NgtBone],
})
export class NgtSkinnedMeshModule {}
