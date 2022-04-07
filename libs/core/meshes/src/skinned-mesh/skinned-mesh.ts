import {
    AnyConstructor,
    applyProps,
    coerceBooleanProperty,
    make,
    NgtCommonMesh,
    NgtInstance,
    NgtInstanceState,
    NgtMatrix4,
    NgtObject,
    NgtStore,
    NgtUnknownInstance,
    prepare,
    provideCommonMeshFactory,
    provideInstanceFactory,
    provideObjectFactory,
    tapEffect,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    NgModule,
    NgZone,
    Optional,
    SkipSelf,
} from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-skinned-mesh',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideCommonMeshFactory<THREE.SkinnedMesh>(NgtSkinnedMesh)],
})
export class NgtSkinnedMesh extends NgtCommonMesh<THREE.SkinnedMesh> {
    @Input() set skeleton(skeleton: THREE.Skeleton) {
        this.set({ skeleton });
    }

    @Input() set useVertexTexture(useVertexTexture: boolean) {
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

    protected override get subInputs(): Record<string, boolean> {
        return {
            ...super.subInputs,
            bindMatrix: true,
            bindMatrixInverse: true,
            bindMode: true,
            skeleton: true,
        };
    }

    bind(skeleton: THREE.Skeleton) {
        this.object3d.bind(
            skeleton,
            this.get((s) => s['bindMatrix'])
        );
    }
}

export interface NgtSkeletonState extends NgtInstanceState<THREE.Skeleton> {
    skeleton: THREE.Skeleton;
    bones: THREE.Bone[];
    boneInverses: THREE.Matrix4[];
    boneMatrices: Float32Array;
    boneTexture: null | THREE.DataTexture;
    boneTextureSize: number;
    frame: number;
}

@Component({
    selector: 'ngt-skeleton',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideInstanceFactory<THREE.Skeleton, NgtSkeletonState>(NgtSkeleton),
    ],
})
export class NgtSkeleton extends NgtInstance<THREE.Skeleton, NgtSkeletonState> {
    @Input() set bones(bones: THREE.Bone[]) {
        this.set({ bones });
    }

    @Input() set boneInverses(boneInverses: NgtMatrix4[]) {
        this.set({
            boneInverses: boneInverses.map((datum) =>
                make(THREE.Matrix4, datum)
            ),
        });
    }

    @Input() set boneMatrices(boneMatrices: Float32Array) {
        this.set({ boneMatrices });
    }

    @Input() set boneTexture(boneTexture: null | THREE.DataTexture) {
        this.set({ boneTexture });
    }

    @Input() set boneTextureSize(boneTextureSize: number) {
        this.set({ boneTextureSize });
    }

    @Input() set frame(frame: number) {
        this.set({ frame });
    }

    constructor(
        zone: NgZone,
        @Optional() private skinnedMesh: NgtSkinnedMesh,
        private store: NgtStore
    ) {
        super({
            zone,
            shouldAttach: true,
            parentInstanceFactory: () =>
                skinnedMesh?.object3d as unknown as NgtUnknownInstance,
        });

        this.set({
            bones: [],
            boneInverses: [],
            boneMatrices: null as unknown as Float32Array,
            boneTexture: null,
            boneTextureSize: 0,
            frame: -1,
        });
    }

    get skeleton(): THREE.Skeleton {
        return this.get((s) => s.skeleton);
    }

    override ngOnInit() {
        this.onCanvasReady(this.store.ready$, () => {
            this.init(
                this.select(
                    this.select((s) => s.bones),
                    this.select((s) => s.boneTexture),
                    this.select((s) => s.boneTextureSize),
                    this.select((s) => s.boneMatrices),
                    this.select((s) => s.boneInverses),
                    this.select((s) => s.frame),
                    (
                        bones,
                        boneTexture,
                        boneTextureSize,
                        boneMatrices,
                        boneInverses,
                        frame
                    ) => ({
                        bones,
                        boneTexture,
                        boneTextureSize,
                        boneMatrices,
                        boneInverses,
                        frame,
                    })
                )
            );
        });
        super.ngOnInit();
    }

    private readonly init = this.effect<
        Pick<
            NgtSkeletonState,
            | 'bones'
            | 'frame'
            | 'boneInverses'
            | 'boneTextureSize'
            | 'boneTexture'
            | 'boneMatrices'
        >
    >(
        tapEffect((inputs) => {
            if (!this.instance) {
                const skeleton = prepare(
                    new THREE.Skeleton(inputs.bones, inputs.boneInverses),
                    () => this.store.get(),
                    this.skinnedMesh.object3d as unknown as NgtUnknownInstance
                );
                this.set({ skeleton, instance: skeleton });
                this.emitReady();

                if (!this.skinnedMesh.object3d.skeleton) {
                    this.skinnedMesh.bind(this.skeleton);
                }
            } else {
                applyProps(
                    this.skeleton as unknown as NgtUnknownInstance,
                    inputs
                );
            }
        })
    );
}

@Component({
    selector: 'ngt-bone',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [provideObjectFactory<THREE.Bone>(NgtBone)],
})
export class NgtBone extends NgtObject<THREE.Bone> {
    constructor(
        zone: NgZone,
        store: NgtStore,
        @Optional() @SkipSelf() private parentBone: NgtBone,
        @Optional() private parentSkinnedMesh: NgtSkinnedMesh,
        @Optional() private parentSkeleton: NgtSkeleton
    ) {
        super(
            zone,
            store,
            () => parentBone?.object3d || parentSkinnedMesh?.object3d
        );
    }

    protected override objectInitFn(): THREE.Bone {
        const bone = new THREE.Bone();

        if (this.parentSkeleton) {
            this.parentSkeleton.skeleton.bones.push(bone);
        }

        return bone;
    }

    override ngOnInit() {
        this.init();
        super.ngOnInit();
    }
}

@NgModule({
    declarations: [NgtSkinnedMesh, NgtSkeleton, NgtBone],
    exports: [NgtSkinnedMesh, NgtSkeleton, NgtBone],
})
export class NgtSkinnedMeshModule {}
