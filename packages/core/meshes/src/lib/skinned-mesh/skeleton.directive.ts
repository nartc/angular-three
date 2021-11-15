import { NgtMatrix4, NgtObject3d } from '@angular-three/core';
import {
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Optional,
  Output,
  QueryList,
  SkipSelf,
} from '@angular/core';
import * as THREE from 'three';
import { NgtBone } from './bone.directive';
import { NgtSkinnedMesh } from './skinned-mesh.directive';

@Directive({
  selector: 'ngt-skeleton',
  exportAs: 'ngtSkeleton',
})
export class NgtSkeleton implements OnInit {
  @Input() boneInverses?: NgtMatrix4[];
  @Output() ready = new EventEmitter<THREE.Skeleton>();

  @ContentChildren(NgtBone) bones?: QueryList<NgtBone>;

  constructor(
    private ngZone: NgZone,
    @Optional() @SkipSelf() private hostObject?: NgtObject3d
  ) {}

  private _skeleton!: THREE.Skeleton;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (this.bones) {
        const boneInverses: THREE.Matrix4[] | undefined = this.boneInverses
          ? this.boneInverses.map((threeMaxtrix) => {
              if (threeMaxtrix instanceof THREE.Matrix4) return threeMaxtrix;
              return new THREE.Matrix4().set(...threeMaxtrix);
            })
          : undefined;
        this._skeleton = new THREE.Skeleton(
          this.bones.map((b) => b.object3d),
          boneInverses
        );

        this.ready.emit(this.skeleton);

        if (this.hostObject) {
          if (this.hostObject instanceof NgtSkinnedMesh) {
            const bindMatrix: THREE.Matrix4 | undefined = this.hostObject
              .bindMatrix
              ? this.hostObject.bindMatrix instanceof THREE.Matrix4
                ? this.hostObject.bindMatrix
                : new THREE.Matrix4().set(...this.hostObject.bindMatrix)
              : undefined;
            this.hostObject.object3d.bind(this._skeleton, bindMatrix);
          }
        }
      }
    });
  }

  get skeleton(): THREE.Skeleton {
    return this._skeleton;
  }
}
