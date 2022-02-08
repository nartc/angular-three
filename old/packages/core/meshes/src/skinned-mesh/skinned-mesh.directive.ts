import {
  NGT_MATERIAL_GEOMETRY_CONTROLLER_PROVIDER,
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NGT_OBJECT_TYPE,
  NGT_OBJECT_WATCHED_CONTROLLER,
  NgtCommonMesh,
  NgtMaterialGeometryControllerModule,
  NgtMatrix4,
  NgtObjectController,
  NgtObjectInputsController,
  zonelessRequestAnimationFrame,
} from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-skinned-mesh',
  exportAs: 'ngtSkinnedMesh',
  providers: [
    { provide: NgtCommonMesh, useExisting: NgtSkinnedMesh },
    NGT_MATERIAL_GEOMETRY_CONTROLLER_PROVIDER,
    { provide: NGT_OBJECT_TYPE, useValue: THREE.SkinnedMesh },
  ],
})
export class NgtSkinnedMesh extends NgtCommonMesh<THREE.SkinnedMesh> {
  @Input() set args(v: [boolean]) {
    if (this.materialGeometryController) {
      this.materialGeometryController.meshArgs = v;
    }
  }

  @Input() bindMatrix?: NgtMatrix4;
  @Input() bindMode?: string;
}

@Directive({
  selector: 'ngt-skeleton',
  exportAs: 'ngtSkeleton',
})
export class NgtSkeleton implements OnInit {
  @Input() boneInverses?: NgtMatrix4[];
  @Output() ready = new EventEmitter<THREE.Skeleton>();

  private _skeleton?: THREE.Skeleton;
  get skeleton() {
    return this._skeleton;
  }

  constructor(@Optional() private skinnedMesh: NgtSkinnedMesh) {
    if (!skinnedMesh) {
      throw new Error('ngt-skeleton must be used within a ngt-skinned-mesh');
    }
  }

  ngOnInit() {
    zonelessRequestAnimationFrame(() => {
      const boneInverses: THREE.Matrix4[] | undefined = this.boneInverses
        ? this.boneInverses.map((threeMaxtrix) => {
            if (threeMaxtrix instanceof THREE.Matrix4) return threeMaxtrix;
            return new THREE.Matrix4().set(...threeMaxtrix);
          })
        : undefined;
      this._skeleton = new THREE.Skeleton([], boneInverses);
      this.ready.emit(this.skeleton);

      if (this.skinnedMesh) {
        const bindMatrix: THREE.Matrix4 | undefined = this.skinnedMesh
          .bindMatrix
          ? this.skinnedMesh.bindMatrix instanceof THREE.Matrix4
            ? this.skinnedMesh.bindMatrix
            : new THREE.Matrix4().set(...this.skinnedMesh.bindMatrix)
          : undefined;
        this.skinnedMesh.mesh.bind(this.skeleton!, bindMatrix);
      }
    });
  }
}

@Directive({
  selector: 'ngt-bone',
  exportAs: 'ngtBone',
  providers: [NGT_OBJECT_CONTROLLER_PROVIDER],
})
export class NgtBone implements OnInit {
  @Output() ready = new EventEmitter<THREE.Bone>();

  private _bone?: THREE.Bone;
  get bone() {
    return this._bone;
  }

  constructor(
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    private objectController: NgtObjectController,
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    private objectInputsController: NgtObjectInputsController,
    @Optional()
    private parentSkinnedMesh: NgtSkinnedMesh,
    @Optional()
    private parentSkeleton: NgtSkeleton
  ) {
    if (!parentSkinnedMesh) {
      throw new Error('ngt-bone must be used within a ngt-skinned-mesh');
    }
    objectInputsController.appendTo = parentSkinnedMesh.mesh;
    objectController.initFn = () => (this._bone = new THREE.Bone());
    objectController.readyFn = () => this.ready.emit(this.bone);
  }

  ngOnInit() {
    this.objectController.init();
    zonelessRequestAnimationFrame(() => {
      if (this.parentSkeleton && this.parentSkeleton.skeleton) {
        this.parentSkeleton.skeleton.bones.push(this.bone!);
      }
    });
  }
}

@NgModule({
  declarations: [NgtSkinnedMesh, NgtBone, NgtSkeleton],
  exports: [
    NgtSkinnedMesh,
    NgtBone,
    NgtSkeleton,
    NgtMaterialGeometryControllerModule,
  ],
})
export class NgtSkinnedMeshModule {}
