import { NgModule } from '@angular/core';
import { NgtBone } from './bone.directive';
import { NgtSkeleton } from './skeleton.directive';
import { NgtSkinnedMesh } from './skinned-mesh.directive';

@NgModule({
  declarations: [NgtBone, NgtSkinnedMesh, NgtSkeleton],
  exports: [NgtBone, NgtSkinnedMesh, NgtSkeleton],
})
export class SkinnedMeshModule {}
