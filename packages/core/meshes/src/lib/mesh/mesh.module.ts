import { NgModule } from '@angular/core';
import { MeshDirective } from './mesh.directive';

@NgModule({
  declarations: [MeshDirective],
  exports: [MeshDirective],
})
export class ThreeMeshModule {}
