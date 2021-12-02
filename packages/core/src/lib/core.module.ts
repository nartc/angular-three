import { NgModule } from '@angular/core';
import { NgtCanvas } from './canvas.component';
import { NgtColorPipeModule } from './color/color.pipe';
import { NgtAnimationSubscriberControllerModule } from './controllers/animation-subscriber.controller';
import { NgtAudioControllerModule } from './controllers/audio.controller';
import { NgtMaterialGeometryControllerModule } from './controllers/material-geometry.controller';
import { NgtObject3dInputsControllerModule } from './controllers/object-3d-inputs.controller';
import { NgtObject3dControllerModule } from './controllers/object-3d.controller';
import { NgtMathPipeModule } from './math/math.pipe';
import { NgtVectorPipeModule } from './vector/vector.pipe';

@NgModule({
  declarations: [NgtCanvas],
  exports: [
    NgtCanvas,
    NgtMaterialGeometryControllerModule,
    NgtObject3dControllerModule,
    NgtObject3dInputsControllerModule,
    NgtAudioControllerModule,
    NgtAnimationSubscriberControllerModule,
    NgtMathPipeModule,
    NgtVectorPipeModule,
    NgtColorPipeModule,
  ],
})
export class NgtCoreModule {}
