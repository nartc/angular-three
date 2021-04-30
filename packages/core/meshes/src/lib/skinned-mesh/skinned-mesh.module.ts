import { NgModule } from '@angular/core';
import { BoneDirective } from './bone.directive';
import { SkeletonDirective } from './skeleton.directive';
import { SkinnedMeshDirective } from './skinned-mesh.directive';

@NgModule({
  declarations: [SkinnedMeshDirective, BoneDirective, SkeletonDirective],
  exports: [SkinnedMeshDirective, BoneDirective, SkeletonDirective],
})
export class ThreeSkinnedMeshModule {}
