import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MeshDirective } from './mesh.directive';

@NgModule({
  declarations: [MeshDirective],
  imports: [CommonModule],
  exports: [MeshDirective],
})
export class ThreeMeshModule {}
