import { ThreeMatrix4, ThreeObject3d } from '@angular-three/core';
import type { QueryList } from '@angular/core';
import {
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Optional,
  Output,
  SkipSelf,
} from '@angular/core';
import { Matrix4, Skeleton } from 'three';
import { BoneDirective } from './bone.directive';
import { SkinnedMeshDirective } from './skinned-mesh.directive';

@Directive({
  selector: 'ngt-skeleton',
  exportAs: 'ngtSkeleton',
})
export class SkeletonDirective implements OnInit {
  @Input() boneInverses?: ThreeMatrix4[];
  @Output() ready = new EventEmitter<Skeleton>();

  @ContentChildren(BoneDirective) bones?: QueryList<BoneDirective>;

  constructor(
    private readonly ngZone: NgZone,
    @Optional() @SkipSelf() private readonly hostObject?: ThreeObject3d
  ) {}

  private _skeleton!: Skeleton;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.bones) {
        const boneInverses: Matrix4[] | undefined = this.boneInverses
          ? this.boneInverses.map((threeMaxtrix) => {
              if (threeMaxtrix instanceof Matrix4) return threeMaxtrix;
              return new Matrix4().set(...threeMaxtrix);
            })
          : undefined;
        this._skeleton = new Skeleton(
          this.bones.map((b) => b.object3d),
          boneInverses
        );

        this.ready.emit(this.skeleton);

        if (this.hostObject) {
          if (this.hostObject instanceof SkinnedMeshDirective) {
            const bindMatrix: Matrix4 | undefined = this.hostObject.bindMatrix
              ? this.hostObject.bindMatrix instanceof Matrix4
                ? this.hostObject.bindMatrix
                : new Matrix4().set(...this.hostObject.bindMatrix)
              : undefined;
            this.hostObject.object3d.bind(this._skeleton, bindMatrix);
          }
        }
      }
    });
  }

  get skeleton(): Skeleton {
    return this._skeleton;
  }
}
