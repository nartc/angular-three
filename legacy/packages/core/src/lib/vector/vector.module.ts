import { NgModule } from '@angular/core';
import { Vector2Pipe, Vector3Pipe, Vector4Pipe } from './vector.pipe';

@NgModule({
  declarations: [Vector2Pipe, Vector3Pipe, Vector4Pipe],
  exports: [Vector2Pipe, Vector3Pipe, Vector4Pipe],
})
export class NgtVectorPipeModule {}
